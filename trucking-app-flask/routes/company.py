from flask import Blueprint, request
from controllers.company_controller import CompanyController

company = Blueprint("company", __name__)


@company.route("/<int:company_id>", methods=["GET"])
def GET(company_id):
    return CompanyController.get(company_id)

@company.route("/<int:company_id>", methods=["PUT"])
def PUT(company_id):
    return CompanyController.update(request, company_id)


@company.route("/<int:company_id>", methods=["DELETE"])
def DELETE(company_id):
    return CompanyController.DELETE(company_id)
