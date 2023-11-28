import os
import stripe
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError  # Import for handling SQLAlchemy specific exceptions
from dotenv import load_dotenv
from dateutil.relativedelta import relativedelta
import datetime
import time

# Load environment variables
load_dotenv(dotenv_path="../.env")

# Stripe API setup
stripe.api_key = os.environ.get("STRIPE_SECRET_API_KEY")  # Stripe secret API key loaded from .env

# Database setup and credentials loaded from environment variables
user = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")
url = os.environ.get("DB_URL")
dbName = os.environ.get("DB_NAME")

# Stripe product details loaded from environment variables
STRIPE_PRICE_ID = os.environ.get("STRIPE_PRICE_ID")

# Create a connection string using credentials from the environment
connection_string = f"mysql+pymysql://{user}:{password}@{url}/{dbName}"

# Create the database engine
engine = create_engine(connection_string)

# Establish a connection with the database
connection = engine.connect()

# Initialize a sessionmaker with the engine
Session = sessionmaker(bind=engine)
session = Session()
print("Database connection and session made.")

# Main function to be called by the scheduler
def main():
    try:
        # SQL query to select users eligible for billing update
        query = text("""
        SELECT id, stripe_id, stripe_subscribed_id, stripe_subscribed_item
        FROM users
        WHERE DATE(created_at) <= CURDATE() - INTERVAL 7 DAY AND stripe_subscribed_id IS NOT NULL;
        """)
        
        # Execute the query to fetch users
        result = connection.execute(query)

        # Fetch all user records returned by the query
        users = result.fetchall()

        # Iterate over each user to process their subscription
        for user in users:
            # Fetch subscription details from Stripe
            subscription = stripe.Subscription.retrieve(user.stripe_subscribed_id)
            
            # Extract current billing period from the subscription
            billing_period_start = subscription['current_period_start']
            billing_period_end = subscription['current_period_end']

            # Query to retrieve usage data for the user within the billing period
            usage_sql = text("""
                SELECT * FROM `usage` WHERE user_id = :user_id AND billing_start_period = :billing_start AND billing_end_period = :billing_end
            """)
            
            # Execute usage query and commit immediately to avoid holding the transaction
            result = connection.execute(usage_sql, {"user_id": user.id, "billing_start": billing_period_start, "billing_end": billing_period_end})
            connection.commit()
            
            # Fetch the usage result for the user
            usage = result.fetchone()
            
            # Check if usage data is not found and continue to the next iteration
            if usage is None:
                print(f"Usage data not found for user: {user.id}")
                continue
            
            # Extract the usage amount from the usage data
            usage_amount = usage[4]  # Assuming 'amount' is the correct key for the usage amount

            # Check for valid usage amounts and continue or log errors accordingly
            if usage_amount <= 0:
                if usage_amount == 0:
                    print(f"SKIP: No usage recorded for user {user.id}")
                else:
                    print(f"ERROR: Usage amount cannot be less than zero for user {user.id}")
                continue

            # Try to create the product usage record in Stripe
            product_usage = stripe.SubscriptionItem.create_usage_record(
                user.stripe_subscribed_item, 
                quantity=usage_amount
            )
            
            usage_id = product_usage["id"]

            # Archive the usage data in a separate table
            usage_archive_sql = text("""
                INSERT INTO usage_archive (user_id, billing_start_period, billing_end_period, amount)
                VALUES (:user_id, :billing_start, :billing_end, :amount);
            """)
            
            connection.execute(usage_archive_sql, {
                "user_id": user.id, 
                "billing_start": usage[2], 
                "billing_end": usage[3], 
                "amount": usage_amount
            })

            # SQL to reset the current usage record for the new billing period
            reset_usage_sql = text("""
                UPDATE `usage` 
                SET billing_start_period = :new_billing_start, 
                    billing_end_period = :new_billing_end, 
                    amount = 0
                WHERE user_id = :user_id 
            """)

            # Calculate the new billing period dates
            new_billing_start = usage[3]
            new_billing_end = int(time.mktime((datetime.datetime.utcfromtimestamp(new_billing_start) + relativedelta(months=1)).timetuple()))

            # Execute the reset usage SQL
            connection.execute(reset_usage_sql, {
                "user_id": user.id, 
                "new_billing_start": new_billing_start, 
                "new_billing_end": new_billing_end
            })

            # Update associated records with the new usage data
            update_sql = text("""
                UPDATE rfos as r
                LEFT JOIN dispatch as d ON d.dispatch_id = r.dispatch_id
                LEFT JOIN company as c ON d.company_id = c.company_id
                LEFT JOIN users as u on c.owner_id = u.id
                SET product_usage = :usage_id
                WHERE u.id = :user_id 
                  AND r.created_at >= :billing_period_start 
                  AND r.created_at < :billing_period_end 
                  AND product_usage IS NULL;
            """)
            connection.execute(update_sql, {
                "usage_id": usage_id, 
                "user_id": user.id, 
                "billing_period_start": billing_period_start, 
                "billing_period_end": billing_period_end
            })

            # Commit the transaction to the database
            connection.commit()
            print(f"USER {user.id} billed")

    except stripe.error.StripeError as e:
        # Print Stripe specific errors and roll back the transaction
        connection.rollback()
        print(f"Stripe Error: {e.user_message}")
    except SQLAlchemyError as e:
        # Handle SQLAlchemy specific errors and roll back the transaction
        connection.rollback()
        print(f"Database Error: {e}")
    except Exception as e:
        # Handle any other exceptions, roll back the transaction, and print an error message
        connection.rollback()
        print(f"An unexpected error occurred: {e} {e.with_traceback()}")

# Entry point for the script
if __name__ == "__main__":
    main()

print("Cron job finished.")
