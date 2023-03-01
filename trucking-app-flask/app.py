import os
from config.db import Session, Base, engine
from utils import loadDB
from routes import v1
from flask import Flask, g
from dotenv import load_dotenv

# Load env variables
load_dotenv()

IS_PRODUCTION = os.environ.get("STATE")

if (IS_PRODUCTION == "development"):
    NUM_USERS = os.environ.get("TEST_DATA_NUM_USERS")
    # # If development clear all database
    Base.metadata.drop_all(engine)

    print("--|--Creating Tables--|--")
    # Create all tables if not already there
    Base.metadata.create_all(engine)

    loadDB(int(NUM_USERS))


def create_app():

    app = Flask(__name__)

    # Register all endpoints
    app.register_blueprint(v1, url_prefix="/v1")

    # Function to create a session for each request
    @app.before_request
    def create_session():
        g.session = Session()

    @app.teardown_request
    def close_session(error):
        if hasattr(g, 'session'):
            g.session.close()

        if error:
            print(error)

    return app
