from flask import Blueprint

rfo = Blueprint("rfo", __name__)


@rfo.route("/")
def home():
    return "RFO"
