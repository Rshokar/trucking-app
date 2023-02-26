from utils import make_response
from models import Company 


class CompanyController:
    
    def get_copmany(session, company_id):
        company = session.query(Company).filter_by(company_id=company_id).first()
        if not company:
            return make_response({"error": "Company not found."}, 404)
        return make_response(company.to_dict(), 200)