from sqlalchemy.exc import IntegrityError
from utils import make_response
from models import Company


class CompanyController:

    def get_copmany(session, company_id):
        company = session.query(Company).filter_by(
            company_id=company_id).first()
        if not company:
            return make_response({"error": "Company not found."}, 404)
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
            return make_response({"error": str(e)}, 400)
        except IntegrityError as e:
            return make_response({"error": "Company already exists."}, 409)
