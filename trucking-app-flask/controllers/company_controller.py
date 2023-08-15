from sqlalchemy.exc import IntegrityError
from utils import make_response
from models import Company
from flask import g


class CompanyController:

    def get_copmany(session):
        company = session.query(Company).filter_by(
            owner_id=g.user["uid"]).first()

        if not company:
            return make_response("Company not found.", 404)

        # check if user is authorized to view company
        if not company.owner_id == g.user["uid"]:
            return make_response("Unauthorized.", 403)

        return make_response(company.to_dict(), 200)

    def create_company(session, request):
        data = request.get_json()
        try:
            company = Company(
                owner_id=data['owner_id'], name=data['company_name'])
            session.add(company)
            session.commit()
            return make_response(company.to_dict(), 200)
        except ValueError as e:
            return make_response(str(e), 400)
        except IntegrityError as e:
            return make_response("Company already exists.", 409)

    def update_company(session, request, company_id):
        company = session.query(Company).filter_by(
            company_id=company_id).first()
        if not company:
            return make_response("Company not found.", 404)

        # check if user is authorized to update company
        if not company.owner_id == g.user["uid"]:
            return make_response("Unauthorized.", 403)

        company.company_name = request.json.get(
            'company_name', company.company_name)
        session.add(company)
        session.commit()
        return make_response(company.to_dict(), 200)

    def delete_company(session, company_id):
        company = session.query(Company).filter_by(
            company_id=company_id).first()
        if not company:
            return make_response("Company not found.", 404)

        # check if user is authorized to delete company
        if not company.owner_id == g.user["uid"]:
            return make_response("Unauthorized.", 403)

        session.delete(company)
        session.commit()
        return make_response("Company deleted.", 200)
