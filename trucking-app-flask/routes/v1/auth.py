import jsonschema
from flask import Blueprint, request, g
from utils import make_response
from validations import auth_validation
from controllers.auth_controller import AuthController
from flask_login import login_required, logout_user
auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    session = g.session
    try:
        jsonschema.validate(request.json, auth_validation)
        print("request: ", request.json)
        return AuthController.LOGIN(session=session, request=request)
    except jsonschema.ValidationError as e:
        return make_response({"error": e.message}, 400)


@auth.route("/logout", methods=["DELETE"])
@login_required
def logout():
    logout_user()
    return make_response("Logout successful", 200)
