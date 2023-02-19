from config.db import Session
from routes import v1
from flask import Flask, g
from dotenv import load_dotenv
load_dotenv()

# Load env variables


# End points


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
