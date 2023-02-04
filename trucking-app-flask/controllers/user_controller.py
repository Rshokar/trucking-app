from flask import Response, abort
from sqlalchemy.exc import IntegrityError
from models.user import User
from config.db import session
import json


class UserController:

    def GET(req):
        req
        return Response(
            response=json.dumps({"data": "USER_GET"}),
            status=200,
            mimetype='application/json'
        )

    def POST(request):
        data = request.get_json()
        try:
            user = User(type=data['type'],
                        email=data['email'], password=data['password'])
            session.add(user)
            session.commit()
            return Response(
                response=json.dumps(user.to_dict()),
                status=200,
                mimetype='application/json'
            )
        except ValueError as e:
            print("This is a ValueError")
            print(repr(e))
            return Response(
                response=str(e),
                status=400,
                mimetype='text/plain'
            )
        except IntegrityError as e: 
            print("This is a IntegrityError error")
            print(repr(e))
            return Response(
                response="Email already used",
                status=409, 
                mimetype='text/plain'
            )

    def PUT(request):
        return Response(
            response=json.dumps({"data": "USER_PUT"}),
            status=200,
            mimetype='application/json'
        )

    def DELETE(request):
        return Response(status=204)
