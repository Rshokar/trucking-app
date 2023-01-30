from flask import Response
import json


class AuthController:

    def LOGIN():
        return Response(
            response=json.dumps({"data": "LOGED_IN"}),
            status=200,
            mimetype='application/json'
        )

    def LOGOUT():
        return Response(status=204)
