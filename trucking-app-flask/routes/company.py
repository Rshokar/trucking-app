from flask import jsonify, request, Blueprint, abort, g
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from config.db import Session
from models.company import Company
from models.customer import Customer

company = Blueprint('company', __name__)

# GET operation (get company by ID)


@company.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    session = g.session
    company = session.query(Company).filter_by(company_id=company_id).first()
    if not company:
        return jsonify({"error": "Company not found."}), 404
    return jsonify(company.to_dict()), 200


# POST operation (create a new company)
@company.route('/', methods=['POST'])
def create_company():
    session = g.session
    company = Company(owner_id=request.json.get('owner_id'),
                      company_name=request.json.get('company_name'))
    session.add(company)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        return jsonify({"error": "Company already exists."}), 409

    return jsonify(company.to_dict()), 201


# PUT operation (update an existing company)
@company.route('/<int:company_id>', methods=['PUT'])
def update_company(company_id):
    session = g.session
    company = session.query(Company).filter_by(company_id=company_id).first()
    if not company:
        return jsonify({"error": "Company not found."}), 404
    company.owner_id = request.json.get('owner_id', company.owner_id)
    company.company_name = request.json.get(
        'company_name', company.company_name)
    session.add(company)
    session.commit()
    return jsonify(company.to_dict()), 200


# DELETE operation (delete an existing company)
@company.route('/<int:company_id>', methods=['DELETE'])
def delete_company(company_id):
    session = g.session
    company = session.query(Company).filter_by(company_id=company_id).first()
    if not company:
        return jsonify({"error": "Company not found."}), 404
    session.delete(company)
    session.commit()
    return '', 204


@company.route('/<int:company_id>/customers', methods=['POST'])
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


@company.route('/<int:company_id>/customers/<int:customer_id>', methods=['DELETE'])
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


@company.route('<int:company_id>/customers/<int:customer_id>', methods=['PUT'])
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
