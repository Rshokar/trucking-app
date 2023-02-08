from flask import Response
from models.company import Company
from utils.make_response import make_response
from config.db import Session
import json


class CompanyController:

    def get(company_id):
        """_summary_

        Args:
            id (int): company_id

        Returns:
            _type_: Response
            
        """
        session = Session()
        company = session.query(Company).filter_by(company_id=company_id).first()
        session.close()
        if not session:
            return make_response("No company found", 404, 'text/plain')
        return make_response(company.to_dict(), status=200)

    def update(request, company_id):
        """_summary_

        Args:
            request (Request): Request
            company_id (int): copmany_id

        Returns:
            _type_: Response
        """
        data = request.get_json()
        session = Session()
        print(f'DATA ON SERVER: {data}')
        company = session.query(Company).filter_by(company_id=company_id).first()
        company.company_name = data['company_name']
        
        try:
            session.commit()
            return make_response(company.to_dict(), 200)
        except ValueError as e:
            return make_response(str(e), 400, 'text/plain')
        except Exception as e:
            return make_response(str(e), 500, 'text/plain')
        