from flask import Response
from models.rfo import RFO
import json


class RfoController:

    def GET():
        return Response(
            response=json.dumps({"data": "RFO_GET"}),
            status=200,
            mimetype='application/json'
        )

    def POST():
        return Response(
            response=json.dumps({"data": "RFO_POST"}),
            status=200,
            mimetype='application/json'
        )

    def PUT():
        return Response(
            response=json.dumps({"data": "RFO_PUT"}),
            status=200,
            mimetype='application/json'
        )

    def DELETE():
        return Response(status=204)
