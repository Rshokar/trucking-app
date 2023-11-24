import os
import stripe
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import datetime

# Load environment variables
load_dotenv(dotenv_path="../.env")

# Stripe API setup
stripe.api_key = os.environ.get("STRIPE_SECRET_API_KEY") # Make sure to set this in your .env file

# Database setup and other cron job logic
user = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")
url = os.environ.get("DB_URL")
dbName = os.environ.get("DB_NAME")

# Subscription product details
STRIPE_PRICE_ID = os.environ.get("STRIPE_PRICE_ID") # The price ID for the subscription

# Create a connection string
connection_string = "mysql+pymysql://{}:{}@{}/{}".format(user, password, url, dbName)

# Create the database engine
engine = create_engine(connection_string)

# Connect to database
connection = engine.connect()

# Create a session
Session = sessionmaker(bind=engine)
session = Session()
print("Database connection and session made.")

# Main function to be called by the scheduler
def main():
    # SQL query
    query = text("""
    SELECT id, stripe_id
    FROM users
    WHERE DATE(created_at) <= CURDATE() - INTERVAL 7 DAY AND stripe_subscribed_id IS NULL;
    """)
    
    # Execute the query
    result = connection.execute(query)

    # Fetch all results
    users = result.fetchall()
    
    print(f"Users: {users}")

    # Process each user
    for user in users:
        # Assuming 'stripe_id' is the customer ID in Stripe
        user_id = user[0]
        stripe_customer_id = user[1]
        
        try:
            # Create the subscription
            sub = stripe.Subscription.create(
                customer=stripe_customer_id,
                items=[
                    {"price": STRIPE_PRICE_ID},
                ],
                # Add other subscription parameters if needed
            )
            print(sub)
            id = sub["id"]
            
            item_id = sub["items"]["data"][0]["id"]
            
            
            print(sub)
            print(f"ID: {id}, {item_id}")
            print()
            
            
            
            # Update your database to mark the user as subscribed
            update_query = text("""
                UPDATE users
                SET stripe_subscribed_id = :id, stripe_subscribed_item = :item
                WHERE id = :user_id;
            """)
            connection.execute(update_query, {"id": id, "user_id": user_id, "item": item_id})
            connection.commit()
            
            add_usage_query = text("""
                INSERT INTO `usage` (user_id, billing_start_period, billing_end_period, amount)
                VALUES (:user_id, :billing_start, :billing_end, 721);
            """)
            connection.execute(add_usage_query, {
                "user_id": user_id, 
                "billing_start": sub["current_period_start"], 
                "billing_end": sub["current_period_end"]
            })
            
            connection.commit()
            print(f"Subscribed user {user_id} to Stripe")

        except stripe.error.StripeError as e:
            # Handle Stripe exceptions
            print(f"Stripe Error: {e.user_message}")
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()


print("Finish")