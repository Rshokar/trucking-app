from flask import Flask

# DB
from config.db import engine
from models.model import Base

# End points
from routes.company import company
from routes.dispatch import dispatch
from routes.rfo import rfo
from routes.billing_ticket import billing_ticket
from routes.auth import auth
from routes.user import user

# Load env variables
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

# Register all endpoints
app.register_blueprint(user, url_prefix="/user")
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(billing_ticket, url_prefix="/billing_ticket")
app.register_blueprint(rfo, url_prefix="/rfo")
app.register_blueprint(dispatch, url_prefix="/dispatch")
app.register_blueprint(company, url_prefix="/company")

# Create DB Tables
try:
    print("--|--CREATING TABLES--|--")
    Base.metadata.create_all(engine)
except Exception as e:
    print("Error:", e)

try:
    # Connect to the database
    connection = engine.connect()
    print("--|--Connection to the database is successful--|--")
except Exception as e:
    print("Error:", e)

if __name__ == "__main__":
    app.run(debug=True)
