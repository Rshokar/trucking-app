import models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.model import Base
from .loader import loadDB
import os

IS_PRODUCTION = os.environ.get("STATE")
TEST_DATA_NUM_USERS = os.environ.get("TEST_DATA_NUM_USERS")

print("HELLO DATABASE--|-- HELLO DATABASE")


connection_string = ""
if (IS_PRODUCTION == "production"):
    user = os.environ.get("DB_USERNAME")
    password = os.environ.get("DB_PASSWORD")
    url = os.environ.get("DB_URL")
    dbName = os.environ.get("DB_NAME")

    # Create a connection string
    connection_string = "mysql+pymysql://{}:{}@{}/{}".format(
        user, password, url, dbName)
else:
    connection_string = "sqlite:///data.db"

# Create the database engine
engine = create_engine(connection_string, echo=True)

# Connect to database
connection = engine.connect()
print("--|--Connection to the database is successful--|--")

# If development clear all database
if (IS_PRODUCTION == "development"):
    print("--|--Drop all tables--|--")
    Base.metadata.drop_all(engine)

print("--|--Creating Tables--|--")
# Create all tables if not already there
Base.metadata.create_all(engine)

# Create a session
Session = sessionmaker(bind=engine)

# Add data if in development
if IS_PRODUCTION == "development":
    loadDB(Session(), int(TEST_DATA_NUM_USERS))
    # Call loader function
