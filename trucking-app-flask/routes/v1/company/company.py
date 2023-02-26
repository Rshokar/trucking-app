from flask import jsonify, request, Blueprint, abort, g
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from config.db import Session
from models.company import Company
from controllers import CompanyController

company = Blueprint('company', __name__)

# GET operation (get company by ID)


@company.route('/<int:company_id>', methods=['GET'])
def get_company(company_id):
    session = g.session
    return CompanyController.get_copmany(session=session, company_id=company_id)


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

