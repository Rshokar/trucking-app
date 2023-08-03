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

# if (IS_PRODUCTION == "development" or IS_PRODUCTION == "test"):
#     # # If development clear all database
#     Base.metadata.drop_all(engine)

#     print("--|--Creating Tables--|--")
#     # Create all tables if not already there
#     Base.metadata.create_all(engine)

#     if (IS_PRODUCTION == "development"):
#         print("--|--Loading Test Data--|--")
#         loadDB(int(1))


app = Flask(__name__)

# SMTP server name provided by AWS
app.config['MAIL_SERVER'] = 'email-smtp.us-west-2.amazonaws.com'
app.config['MAIL_PORT'] = 587  # Port number provided by AWS
# SMTP username provided by AWS
app.config['MAIL_USERNAME'] = 'AKIA56YFAK5VQDUD56U2'
# SMTP password provided by AWS
app.config['MAIL_PASSWORD'] = 'BOxXBK/OHsOFXcapQAuuhRvrblCxHL1BEU/2enfB9n3t'
app.config['MAIL_USE_TLS'] = True  # AWS recommends using StartTLS
app.config['MAIL_USE_SSL'] = False

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
