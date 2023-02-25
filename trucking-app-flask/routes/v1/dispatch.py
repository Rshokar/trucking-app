from flask import Blueprint, g, jsonify, request
from models import Dispatch, Company, Customer
from datetime import datetime
from controllers import DispatchController

dispatch = Blueprint("dispatch", __name__)


@dispatch.route('/<int:dispatch_id>', methods=['GET'])
def get_dispatch(dispatch_id):
    session = g.session
    return DispatchController.get_dispatch(session=session, dispatch_id=dispatch_id)
    


@dispatch.route('/', methods=['POST'])
def create_dispatch():
    session = g.session
    request_data = request.get_json()
    company_id = request_data.get('company_id')
    customer_id = request_data.get('customer_id')
    notes = request_data.get('notes')
    date = request_data.get('date')

    company = session.query(Company).filter_by(company_id=company_id)
    if company is None:
        return jsonify({'error': 'Company not found'}), 404
    customer = session.query(Customer).filter_by(
        customer_id=customer_id).first()
    if customer is None:
        return jsonify({'error': 'Customer not found'}), 404
    dispatch = Dispatch(company_id, customer_id, notes,
                        datetime.strptime(date, '%Y-%m-%d %H:%M:%S'))
    session.add(dispatch)
    session.commit()
    return jsonify({'message': 'Dispatch created successfully', 'dispatch': dispatch.to_dict()}), 201


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
