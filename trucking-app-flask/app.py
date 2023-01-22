from flask import Flask

from routes.user import user
from routes.auth import auth
from routes.billing_ticket import billing_ticket
from routes.rfo import rfo
from routes.dispatch import dispatch
from routes.company import company

app = Flask(__name__)

app.register_blueprint(user, url_prefix="/user")
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(billing_ticket, url_prefix="/billing_ticket")
app.register_blueprint(rfo, url_prefix="/rfo")
app.register_blueprint(dispatch, url_prefix="/dispatch")
app.register_blueprint(company, url_prefix="/company")


@app.get("/")
def home():
    return "Hell World"


if __name__ == "__main__":
    app.run(debug=True)
