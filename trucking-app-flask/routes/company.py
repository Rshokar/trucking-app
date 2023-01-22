from flask import Blueprint

company = Blueprint("company", __name__)


@company.route("/")
def home():
    return "COMPANY"
