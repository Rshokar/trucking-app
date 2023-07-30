from flask import Blueprint, g, request
from controllers.operator_controller import OperatorController
from utils import make_response
from validations import operator_validation, operator_update
from flask_login import login_required
import jsonschema

operators = Blueprint("operators", __name__)


@operators.route("/<int:operator_id>", methods=["GET"])
@login_required
def get_operator(operator_id):
    session = g.session
    return OperatorController.get_operator(session, operator_id=operator_id)


@operators.route("/", methods=["GET"])
@login_required
def get_all_operators():    # get query string parameters with defaults
    session = g.session
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 0))
    # pass query string parameters to DispatchController
    return OperatorController.get_all_operators(session=session, limit=limit, page=page)


@operators.route("/", methods=["POST"])
@login_required
def create_operator():
    session = g.session
    try:
        jsonschema.validate(request.json, operator_validation)
        return OperatorController.create_operator(session, request=request)
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": "Invalid Request Data"}, 400)


@operators.route("/<int:operator_id>", methods=["PUT"])
@login_required
def update_operator(operator_id):
    session = g.session
    print(request.json)
    try:
        jsonschema.validate(request.json, operator_update)
        return OperatorController.update_operator(session, request=request, operator_id=operator_id)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)


@operators.route("/<int:operator_id>", methods=["DELETE"])
@login_required
def delete_operator(operator_id):
    session = g.session
    return OperatorController.delete_operator(session=session, operator_id=operator_id)
