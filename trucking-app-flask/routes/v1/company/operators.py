from flask import Blueprint, g, request
from controllers.operator_controller import OperatorController
from utils import make_response
from validations import operator_validation, operator_update
import jsonschema
from middleware import firebase_required


operators = Blueprint("operators", __name__)


@operators.route("/<int:operator_id>", methods=["GET"])
@firebase_required
def get_operator(operator_id):
    session = g.session
    return OperatorController.get_operator(session, operator_id=operator_id)


@operators.route("/", methods=["GET"])
@firebase_required
def get_all_operators():    # get query string parameters with defaults
    session = g.session
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 0))
    # pass query string parameters to DispatchController
    return OperatorController.get_all_operators(session=session, limit=limit, page=page)


@operators.route("/", methods=["POST"])
@firebase_required
def create_operator():
    session = g.session
    try:
        jsonschema.validate(request.json, operator_validation)
        return OperatorController.create_operator(session, request=request)
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": "Invalid Request Data"}, 400)


@operators.route('/<int:operator_id>', methods=["POST"])
@firebase_required
def send_validation_email(operator_id):
    if (operator_id <= 0):
        return make_response("Operator_id is invalid", 400)
    return OperatorController.send_validation_email(g.session, operator_id)


@operators.route("/<int:operator_id>", methods=["PUT"])
@firebase_required
def update_operator(operator_id):
    session = g.session
    print(request.json)
    try:
        jsonschema.validate(request.json, operator_update)
        return OperatorController.update_operator(session, request=request, operator_id=operator_id)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)


@operators.route("/<int:operator_id>", methods=["DELETE"])
@firebase_required
def delete_operator(operator_id):
    session = g.session
    return OperatorController.delete_operator(session=session, operator_id=operator_id)

# used to validate a operators email.


@operators.route('/validate', methods=["POST"])
def validate_operators():
    session = g.session
    print("HELLO WORLD")
    try:
        token = request.get_json().get("token", None)
        return OperatorController.validate_operator(session, token)
    except Exception as e:
        print(e)
        return make_response("Error validating operator.", 500)

# Endpoint for generating an authentication token for operators.
# This will create an email containing a six-digit token and send it to the operator.
# The token, along with the time of creation, will be saved in the database for later validation.


@operators.route('/generate_token/<string:request_token>', methods=["POST"])
def generate_token(request_token):
    session = g.session
    return OperatorController.generate_operator_auth_token(session, request_token)

# Endpoint for validating an authentication token provided by an operator.
# If the token is valid, an access token will be returned for subsequent requests.


@operators.route('/validate_token/<string:request_token>', methods=["POST"])
def validate(request_token):
    session = g.session

    code = request.get_json().get("code", None)

    if code is None:
        return make_response("Code is missing", 400)

    return OperatorController.validate_operator_auth_token(session, request_token)

# Endpoint for retrieving ticket information for a given RFO (Request For Operator) encoded in the access token.
# The returned information includes details on dispatch, RFO, bills, company, and customer.


@operators.route('/ticket', methods=["GET"])
def get_rfo():
    authhead = request.headers.get("Authorization-Fake-X", None)

    # Check if the Authorization header is present in the request.
    if authhead is None:
        return make_response("Auth header missing", 400)

    # Extract the access token from the Authorization header.
    access_token = authhead.split(" ")[1]

    # Return the ticket information associated with the provided access token.
    return OperatorController.get_rfo(g.session, access_token)
