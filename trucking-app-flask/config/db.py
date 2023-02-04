from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

IS_PRODUCTION = os.environ.get("PRODUCTION")

connection_string = ""
if (IS_PRODUCTION == 1):
    user = os.environ.get("DB_USERNAME")
    password = os.environ.get("DB_PASSWORD")
    url = os.environ.get("DB_URL")
    dbName = os.environ.get("DB_NAME")

    # Create a connection string
    connection_string = "mysql+pymysql://{}:{}@{}/{}".format(
        user, password, url, dbName)
else: 
    connection_string = "sqlite:///:memory:"

# Create the database engine
engine = create_engine(connection_string, echo=True)

session = sessionmaker(bind=engine)()


