from flask import Blueprint
from controllers.auth_controller import AuthController
auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    return AuthController.LOGIN()


@auth.route("/logout", methods=["DELETE"])
def logout():
    return AuthController.LOGOUT()