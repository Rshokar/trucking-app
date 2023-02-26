from flask import Response
from models.operator import Operator
import json

class OperatorController:
    #@app.route('/', methods=["GET"])
    def GET():
        return Response(
            response=json.dumps({"data": "OPERATOR_GET"}),
            status=200,
            mimetype='application/json'
        )
        #alternatively can return an HTML template via a templating engine - maybe Jinja?
    

    #@app.route('/', methods=["POST"])
    def POST():
        return Response(
            response=json.dumps({"data": "OPERATOR_POST"}),
            status=200,
            mimetype='application/json'
        )

    #@app.route('/', methods=["PUT"])
    def PUT():
        return Response(
            response=json.dumps({"data": "OPERATOR_PUT"}),
            status=200,
            mimetype='application/json'
        )

    #@app.route('/', methods=["DELETE"])
    def DELETE():
        return Response(status=204) #204 - No Content