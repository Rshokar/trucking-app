from flask import Blueprint, jsonify, request, make_response, g
from controllers import CustomerController
from validations import customer_validation
from middleware import firebase_required
import jsonschema

customers = Blueprint("customers", __name__)


@customers.route('/<int:customer_id>', methods=['GET'])
@firebase_required
def get_customer(customer_id):
    return CustomerController.get_customer(g.session, customer_id)


@customers.route("/", methods=["GET"])
@firebase_required
def get_all_customers():  # get query string parameters with defaults
    # return make_response("ERROR", 401)
    session = g.session
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 0))
    # pass query string parameters to DispatchController
    return CustomerController.get_all_customers(session=session, limit=limit, page=page)


@customers.route('/', methods=['POST'])
@firebase_required
def create_customer():
    try:
        jsonschema.validate(request.get_json(), customer_validation)
        return CustomerController.create_customer(g.session, request)
    except jsonschema.exceptions.ValidationError as e:
        return jsonify({"error": e.message}), 400


@customers.route('/<int:customer_id>', methods=['DELETE'])
@firebase_required
def delete_customer(customer_id):
    return CustomerController.delete_customer(g.session, customer_id)


@customers.route('<int:customer_id>', methods=['PUT'])
@firebase_required
def update_customer(customer_id):
    try:
        jsonschema.validate(request.get_json(), customer_validation)
        return CustomerController.update_customer(g.session, request, customer_id)
    except jsonschema.exceptions.ValidationError as e:
        return jsonify({"error": e.message}), 400
