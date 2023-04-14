import jsonschema
from flask import Blueprint, request, g
from utils import make_response
from validations import auth_validation
from controllers.auth_controller import AuthController
from flask_login import login_required
auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    session = g.session
    try:
        jsonschema.validate(request.json, auth_validation)
        return AuthController.login(session=session, request=request)
    except jsonschema.exceptions.ValidationError as e:
        return make_response({"error": e.message}, 400)


@auth.route("/logout", methods=["DELETE"])
@login_required
def logout():
    return AuthController.logout()
