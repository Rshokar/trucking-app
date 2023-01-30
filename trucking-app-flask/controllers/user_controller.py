from flask import Response
from models.user import User
import json


class UserController:

    def GET():
        return Response(
            response=json.dumps({"data": "USER_GET"}),
            status=200,
            mimetype='application/json'
        )

    def POST():
        return Response(
            response=json.dumps({"data": "USER_POST"}),
            status=200,
            mimetype='application/json'
        )

    def PUT():
        return Response(
            response=json.dumps({"data": "USER_PUT"}),
            status=200,
            mimetype='application/json'
        )

    def DELETE():
        return Response(status=204)
