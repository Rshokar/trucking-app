import os
import stripe
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

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
    SELECT id, stripe_id, stripe_subscribed_id, stripe_subscribed_item
    FROM users
    WHERE DATE(created_at) <= CURDATE() - INTERVAL 7 DAY AND stripe_subscribed_id IS NOT NULL;
    """)
    
    # Execute the query
    result = connection.execute(query)

    # Fetch all results
    users = result.fetchall()
    
    print(f"Users: {users}")

    # # Process each user
    for user in users:
       # Fetch subscription details from Stripe
        try:
            subscription = stripe.Subscription.retrieve(user.stripe_subscribed_id)
            print(subscription)
            # Extract billing period
            billing_period_start = subscription['current_period_start']
            billing_period_end = subscription['current_period_end']

            # Calculate usage for the user within the billing period
            # You need to implement this part based on your usage tracking mechanism
            usage_sql = text(f"""
                SELECT COUNT(*) FROM rfos as r
                LEFT JOIN dispatch as d ON d.dispatch_id = r.dispatch_id
                LEFT JOIN company as c ON d.company_id = c.company_id
                LEFT JOIN users as u on c.owner_id = u.id
                WHERE u.id = '{user.id}' AND r.created_at >= {billing_period_start} AND r.created_at < {billing_period_end};
            """)

            print(usage_sql)
            
            result = connection.execute(usage_sql)
            connection.commit()
            
            usage = result.fetchone()[0]
            
            if usage == 0: 
                print(f"SKIP: No usage recorded for {user.id}")
                continue
            
            # We have the usage, now we have to create the product usage records in stripe
            try:
                product_usage = stripe.SubscriptionItem.create_usage_record(user.stripe_subscribed_item, quantity=usage)
                usage_id = product_usage["id"] 
            except stripe.error.CardError as e:
                print(f"STRIPE CARD ERROR: Error when creating customer usage for: {user.id}")
                continue
            except stripe.error.RateLimitError as e:
                print(f"STRIPE RATE LIMIT ERROR: Error when creating customer usage for: {user.id}")
                continue
            except stripe.error.InvalidRequestError as e:
                print(f"STRIPE INVALID REQUEST ERROR: Error when creating customer usage for: {user.id}")
                continue
            except stripe.error.AuthenticationError as e:
                print(f"STRIPE AUTHENTICATION ERROR: Error when creating customer usage for: {user.id}")
                continue
            except stripe.error.APIConnectionError as e:
                print(f"STRIPE API CONNECTION ERROR: Error when creating customer usage for: {user.id}")
                continue
            except stripe.error.StripeError as e:
                print(f"STRIPE ERROR: Error when creating customer usage for: {user.id}")
                continue
            except Exception as e:
                print(f"ERROR: Error when creating customer usage for: {user.id}")
                continue
            
            
            update_sql = text(f"""
                UPDATE rfos as r
                LEFT JOIN dispatch as d ON d.dispatch_id = r.dispatch_id
                LEFT JOIN company as c ON d.company_id = c.company_id
                LEFT JOIN users as u on c.owner_id = u.id
                SET product_usage = '{usage_id}'
                WHERE u.id = '{user.id}' AND r.created_at >= {billing_period_start} AND r.created_at < {billing_period_end};
            """)
            
            print(update_sql)
            
            result = connection.execute(update_sql)
            connection.commit()
            
        except stripe.error.StripeError as e:
            print(f"Stripe Error: {e}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()


print("Finish")



