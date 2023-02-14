# Load env variables
from dotenv import load_dotenv
load_dotenv()
from flask import Flask


# End points
from routes.company import company
# from routes.dispatch import dispatch
# from routes.rfo import rfo
# from routes.billing_ticket import billing_ticket
# from routes.auth import auth
from routes.user import user

import config.db


def create_app():

    app = Flask(__name__)

    # Register all endpoints
    app.register_blueprint(user, url_prefix="/user")
    # app.register_blueprint(auth, url_prefix="/auth")
    # app.register_blueprint(billing_ticket, url_prefix="/billing_ticket")
    # app.register_blueprint(rfo, url_prefix="/rfo")
    # app.register_blueprint(dispatch, url_prefix="/dispatch")
    app.register_blueprint(company, url_prefix="/company")


    return app

