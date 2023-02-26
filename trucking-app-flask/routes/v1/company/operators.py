from flask import Blueprint, g, request
from controllers.operator_controller import OperatorController
from utils import make_response
from validations import operator_validation
import jsonschema

operators = Blueprint("operators", __name__)

@operators.route("/<int:operator_id>", methods=["GET"])
def create_operator(operator_id):
    session = g.session
    return OperatorController.get_operator(session, operator_id=operator_id)


@operators.route("/", methods=["POST"])
def POST():
    session = g.session
    try: 
        jsonschema.validate(request.json, operator_validation)
        return OperatorController.create_operator(session, request=request)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)

@operators.route("/<int:operator_id>", methods=["PUT"])
def PUT(operator_id):
    session = g.session
    try: 
        jsonschema.validate(request.json, operator_validation)
        return OperatorController.update_operator(session, request=request, operator_id=operator_id)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)


@operators.route("/<int:operator_id>/<int:company_id>", methods=["DELETE"])
def DELETE(operator_id, company_id):
    session = g.session
    return OperatorController.delete_operator(session=session, operator_id=operator_id, company_id=company_id)
