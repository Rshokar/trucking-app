from flask import jsonify, request, Blueprint, g
from models.company import Company
from controllers import CompanyController
from validations import company_validation, company_update
from utils import make_response
from middleware import firebase_required
import jsonschema

company = Blueprint('company', __name__)


@company.route('/', methods=['GET'])
@firebase_required
def get_company():
    session = g.session
    return CompanyController.get_copmany(session=session)


@company.route('/', methods=['POST'])
@firebase_required
def create_company():
    session = g.session
    try:
        jsonschema.validate(request.json, company_validation)
        return CompanyController.create_company(session=session, request=request)
    except jsonschema.exceptions.ValidationError as e:
        return make_response({"error": str(e)}, 400)


@company.route('/<int:company_id>', methods=['PUT'])
@firebase_required
def update_company(company_id):
    session = g.session
    try:
        jsonschema.validate(request.json, company_update)
        return CompanyController.update_company(session=session, request=request, company_id=company_id)
    except jsonschema.exceptions.ValidationError as e:
        return make_response({"error": str(e)}, 400)


@company.route('/<int:company_id>', methods=['DELETE'])
@firebase_required
def delete_company(company_id):
    session = g.session
    return CompanyController.delete_company(session=session, company_id=company_id)
