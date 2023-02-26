from flask import Blueprint, g, jsonify, request
from models import Dispatch, Company, Customer
from datetime import datetime
from controllers import DispatchController
from validations import dispatch_validation
from utils import make_response
import jsonschema

dispatch = Blueprint("dispatch", __name__)


@dispatch.route('/<int:dispatch_id>', methods=['GET'])
def get_dispatch(dispatch_id):
    session = g.session
    return DispatchController.get_dispatch(session=session, dispatch_id=dispatch_id)
    


@dispatch.route('/', methods=['POST'])
def create_dispatch():
    session = g.session
    try:
        jsonschema.validate(request.json, dispatch_validation)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)
    return DispatchController.create_dispatch(session=session, request=request)

@dispatch.route('/<int:dispatch_id>', methods=['PUT'])
def update_dispatch(dispatch_id):
    session = g.session
    dispatch = session.query(Dispatch).get(dispatch_id)
    if dispatch is None:
        return jsonify({'error': 'Dispatch not found'}), 404
    request_data = request.get_json()
    if 'customer_id' in request_data:
        customer_id = request_data['customer_id']
        customer = session.query(Customer).get(customer_id)
        if customer is None:
            return jsonify({'error': 'Customer not found'}), 404
        dispatch.customer = customer
    if 'notes' in request_data:
        dispatch.notes = request_data['notes']
    if 'date' in request_data:
        dispatch.date = request_data['date']
    session.commit()
    return jsonify({'message': 'Dispatch updated successfully', 'dispatch': dispatch.to_dict()})


@dispatch.route('/<int:dispatch_id>', methods=['DELETE'])
def delete_dispatch(dispatch_id):
    session = g.session
    dispatch = session.query(Dispatch).get(dispatch_id)
    if dispatch is None:
        return jsonify({'error': 'Dispatch not found'}), 404
    session.delete(dispatch)
    session.commit()
    return jsonify({'message': 'Dispatch deleted successfully'})
