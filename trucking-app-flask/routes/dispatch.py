from flask import Blueprint

dispatch = Blueprint("dispatch", __name__)


@dispatch.route("/")
def home():
    return "DISPATCH"
