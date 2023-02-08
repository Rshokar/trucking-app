from flask import Blueprint
from controllers.company_controller import CompanyController

company = Blueprint("company", __name__)


@company.route("/<int:company_id>", methods=["GET"])
def GET(company_id):
    return CompanyController.get_company(company_id)


@company.route("/", methods=["POST"])
def POST():
    return CompanyController.POST()


@company.route("/", methods=["PUT"])
def PUT():
    return CompanyController.PUT()


@company.route("/", methods=["DELETE"])
def DELETE():
    return CompanyController.DELETE()
