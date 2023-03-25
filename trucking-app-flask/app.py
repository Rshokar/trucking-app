import os
from config.db import Session, Base, engine
from utils import loadDB
from routes import v1
from flask import Flask, g
from dotenv import load_dotenv
from flask_login import LoginManager
from models import User

# Load env variables
load_dotenv()

IS_PRODUCTION = os.environ.get("STATE")

if (IS_PRODUCTION == "development" or IS_PRODUCTION == "test"):
    NUM_USERS = os.environ.get("TEST_DATA_NUM_USERS")
    # # If development clear all database
    Base.metadata.drop_all(engine)

    print("--|--Creating Tables--|--")
    # Create all tables if not already there
    Base.metadata.create_all(engine)

    if (IS_PRODUCTION == "development"):
        print("--|--Loading Test Data--|--")
        loadDB(int(NUM_USERS))


def create_app():

    app = Flask(__name__)

    # Set secret key for auth session
    app.secret_key = 'fzV2T57K8JmQJ@C'

    # Initialize login manager
    login_manager = LoginManager(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id, callback=None):
        session = Session()
        return session.query(User).get(user_id)

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
