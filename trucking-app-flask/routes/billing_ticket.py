from flask import Blueprint

billing_ticket = Blueprint("billing_ticket", __name__)


@billing_ticket.route("/")
def home():
    return "BILLING_TIKCET"
