import os
from config.stripe import stripe
from routes import v1
from config.db import Session, Base, engine
from flask import Flask, g
from flask_cors import CORS
from dotenv import load_dotenv
from models import User
from utils import loadDB

# Load env variables
load_dotenv()

MAX_CONTENT_SIZE = os.environ.get("MAX_CONTENT_SIZE")
IS_PRODUCTION = os.environ.get("STATE") == 'production'

# Register static web endpoint
# STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')

app = Flask(__name__)

CORS(app)

# SMTP server name provided by AWS
app.config['MAIL_SERVER'] = os.environ.get("SES_MAIL_SERVER")
app.config['MAIL_PORT'] = os.environ.get(
    "SES_MAIL_PORT")  # Port number provided by AWS
# SMTP username provided by AWS
app.config['MAIL_USERNAME'] = os.environ.get("SES_MAIL_USERNAME")
# SMTP password provided by AWS
app.config['MAIL_PASSWORD'] = os.environ.get("SES_MAIL_PASSWORD")
app.config['MAIL_USE_TLS'] = True  # AWS recommends using StartTLS
app.config['MAIL_USE_SSL'] = False
app.config['MAX_CONTENT_LENGTH'] = int(MAX_CONTENT_SIZE)  # 16 megabytes

# Set secret key for auth session
app.secret_key = 'fzV2T57K8JmQJ@C'


# Register all endpoints
app.register_blueprint(v1, url_prefix="/v1")
app.route('/')


# Route to serve the React application
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_static_app(path):
#     return app.send_static_file('index.html')

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


# if not IS_PRODUCTION:
#     print("Dropping and rebuilding the database...")
#     Base.metadata.drop_all(engine)  # Drop all tables
#     Base.metadata.create_all(engine)  # Create all tables
#     loadDB(1, 0, 0, 0)
#     print("Database has been reset.")
# else:
#     print("Skipped database reset in production environment.")
    