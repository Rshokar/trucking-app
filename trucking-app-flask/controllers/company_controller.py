from flask import Response
import json


class CompanyController:

    def GET():
        return Response(
            response=json.dumps({"data": "COMPANY_GET"}),
            status=200,
            mimetype='application/json'
        )

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
