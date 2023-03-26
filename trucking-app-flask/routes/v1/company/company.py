from flask import jsonify, request, Blueprint, g
from models.company import Company
from controllers import CompanyController
from validations import company_validation, company_update
from utils import make_response
from flask_login import login_required
import jsonschema

company = Blueprint('company', __name__)


@company.route('/<int:company_id>', methods=['GET'])
@login_required
def get_company(company_id):
    session = g.session
    return CompanyController.get_copmany(session=session, company_id=company_id)


@company.route('/', methods=['POST'])
@login_required
def create_company():
    session = g.session
    try:
        jsonschema.validate(request.json, company_validation)
        return CompanyController.create_company(session=session, request=request)
    except jsonschema.exceptions.ValidationError as e:
        return make_response({"error": str(e)}, 400)


@company.route('/<int:company_id>', methods=['PUT'])
@login_required
def update_company(company_id):
    session = g.session
    try:
        jsonschema.validate(request.json, company_update)
        return CompanyController.update_company(session=session, request=request, company_id=company_id)
    except jsonschema.exceptions.ValidationError as e:
        return make_response({"error": str(e)}, 400)


@company.route('/<int:company_id>', methods=['DELETE'])
@login_required
def delete_company(company_id):
    session = g.session
    return CompanyController.delete_company(session=session, company_id=company_id)
