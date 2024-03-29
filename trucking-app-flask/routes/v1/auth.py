import jsonschema
from flask import Blueprint, request, g
from utils import make_response
from validations import auth_validation, register_validation
from controllers.auth_controller import AuthController
from middleware import firebase_required
auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["POST"])
def login():
    session = g.session
    try:
        jsonschema.validate(request.json, auth_validation)
        return AuthController.login(session=session, request=request)
    except jsonschema.exceptions.ValidationError as e:
        return make_response({"error": e.message}, 400)


@auth.route("/re_auth", methods=["POST"])
def re_auth():
    try:
        jsonschema.validate(request.json, auth_validation)
        return AuthController.re_auth(request=request)
    except jsonschema.exceptions.ValidationError as e:
        return make_response({"error": e.message}, 400)


@auth.route("/logout", methods=["DELETE"])
@firebase_required
def logout():
    return AuthController.logout()


@auth.route("/register", methods=["POST"])
def register():
    session = g.session
    try:
        jsonschema.validate(request.json, register_validation)
        return AuthController.register(session=session, request=request)
    except jsonschema.exceptions.ValidationError as e:
        return make_response({"error": e.message}, 400)
