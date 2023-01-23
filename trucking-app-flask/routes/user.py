from flask import Blueprint
from models.user import User

user = Blueprint("user", __name__)


@user.route("/")
def home():
    return "USER"
