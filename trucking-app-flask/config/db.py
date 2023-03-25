import models
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.model import Base
import os

IS_PRODUCTION = os.environ.get("STATE")
TEST_DATA_NUM_USERS = os.environ.get("TEST_DATA_NUM_USERS")


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
engine = create_engine(connection_string)

# Connect to database
connection = engine.connect()
print("--|--Connection to the database is successful--|--")


# Create a session
Session = sessionmaker(bind=engine)
