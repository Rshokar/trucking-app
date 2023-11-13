import models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.model import Base
import os

IS_PRODUCTION = os.environ.get("STATE") == 'production'
TEST_DATA_NUM_USERS = os.environ.get("TEST_DATA_NUM_USERS")


user = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")
url = os.environ.get("DB_URL")
dbName = os.environ.get("DB_NAME")

# Create a connection string
connection_string = "mysql+pymysql://{}:{}@{}/{}".format(
    user, password, url, dbName)

# Create the database engine
engine = create_engine(connection_string)

# Connect to database
connection = engine.connect()
print("--|--Connection to the database is successful--|--")

if not IS_PRODUCTION:
    print("Dropping and rebuilding the database...")
    Base.metadata.drop_all(engine)  # Drop all tables
    Base.metadata.create_all(engine)  # Create all tables
    print("Database has been reset.")
else:
    print("Skipped database reset in production environment.")


# Create a session
Session = sessionmaker(bind=engine)
