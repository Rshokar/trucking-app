from flask import Blueprint, jsonify, request, abort, g
from sqlalchemy import and_
from models import Company, Customer


customers = Blueprint("customers", __name__)

@customers.route('/<int:company_id>', methods=['POST'])
def add_customer(company_id):
    session = g.session
    company = session.query(Company).filter_by(company_id=company_id)
    if not company:
        return jsonify({'error': 'Company not found'}), 404

    data = request.get_json()

    if 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400

    customer = Customer(company_id=company_id, customer_name=data['name'])

    session.add(customer)
    session.commit()
    return jsonify(customer.to_dict()), 201


@customers.route('/<int:company_id>/<int:customer_id>', methods=['DELETE'])
def delete_customer(company_id, customer_id):
    session = g.session
    # get the company
    company = session.query(Company).filter_by(company_id=company_id)
    if not company:
        abort(404, description="Company not found")

    # get the customer
    customer = session.query(Customer).filter(and_(
        Customer.company_id.like(company_id),
        Customer.customer_id.like(customer_id)
        )).first()
    
    if not customer:
        abort(404, description="Customer not found")

    # check if the customer has any dispatches
    if customer.dispatches:
        customer.deleted = True
        session.commit()
        return jsonify({"message": f"Customer {customer_id} deleted (marked as deleted due to dependent dispatches)"}), 200

    # delete the customer
    session.delete(customer)
    session.commit()

    return jsonify({"message": f"Customer {customer_id} deleted from company {company_id}"}), 200


@customers.route('<int:company_id>/<int:customer_id>', methods=['PUT'])
def update_customer(company_id, customer_id):
    session = g.session
    company = session.query(Company).filter_by(company_id=company_id)
    if company is None:
        return jsonify({'error': 'Company not found'}), 404

    customer = session.query(Customer).filter(and_(
        Customer.company_id.like(company_id),
        Customer.customer_id.like(customer_id)
        )).first()
    
    if customer is None:
        return jsonify({'error': 'Customer not found'}), 404

    request_data = request.get_json()
    if 'customer_name' in request_data:
        customer.customer_name = request_data['customer_name']
        session.commit()

    return jsonify({'message': 'Customer updated successfully', 'customer': customer.to_dict()})


