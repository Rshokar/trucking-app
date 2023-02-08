from flask import Response
from models.company import Company
from utils.make_response import make_response
from config.db import Session
import json


class CompanyController:

    def get_company(company_id):
        """_summary_

        Args:
            id (int): company_id

        Returns:
            _type_: Response
            
        """
        session = Session()
        company = session.query(Company).filter_by(company_id=company_id).first()
        session.close()
        print("HELLO")
        if not session:
            return make_response("No company found", 404, 'text/plain')
        return make_response(company.to_dict(), status=200)

    def POST():
        return Response(
            response=json.dumps({"data": "COMPANY_POST"}),
            status=200,
            mimetype='application/json'
        )

    def PUT():
        return Response(
            response=json.dumps({"data": "COMPANY_PUT"}),
            status=200,
            mimetype='application/json'
        )

    def DELETE():
        return Response(status=204)
