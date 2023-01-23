from sqlalchemy import create_engine
import os

user = os.environ.get("DB_USERNAME")
password = os.environ.get("DB_PASSWORD")
url = os.environ.get("DB_URL")
dbName = os.environ.get("DB_NAME")


# Create a connection string
connection_string = "mysql+pymysql://{}:{}@{}/{}".format(
    user, password, url, dbName)

# Create the database engine
engine = create_engine(connection_string, echo=True)
