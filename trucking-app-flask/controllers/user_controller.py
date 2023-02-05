from flask import Response
from sqlalchemy.exc import IntegrityError
from models.user import User
from utils.make_response import make_response
from config.db import Session
import json


class UserController:

    def GET(req, user_id):
        # if no user if found None will be returned. None is falsey
        session = Session()
        user = session.query(
            User
            ).with_entities(
                User.email, User.id, User.type
            ).filter_by(
                id=user_id
            ).first()
        session.close()
        if not user:
            return make_response("No user found", 404, 'text/plain')
        return make_response(user._asdict(), 200)

    def POST(request):
        session = Session()
        data = request.get_json()
        try:
            user = User(type=data['type'],
                        email=data['email'], password=data['password'])
            session.add(user)
            session.commit()
            return make_response(user.to_dict(), 200)
        except ValueError as e:
            return make_response(str(e), 400,'text/plain')
        except IntegrityError as e: 
            return make_response("Email already used",409, 'text/plain')
        finally: 
            session.close()


    def PUT(request, id):
        session = Session()
        data = request.get_json()
        try:
            user = session.query(User).filter_by(id=id).first()
            user.type = data['type']
            user.email = data['email']
            user.password = data['password']
            session.commit()
            return make_response(user.to_dict(), 200 )
        except ValueError as e:
            return make_response(str(e), 400,'text/plain')
        except IntegrityError as e: 
            return make_response("Email already used",409, 'text/plain') 
        finally: 
            session.close()
            

    def DELETE(request, id):
        session = Session()
        user = session.query(User).filter_by(id=id).first()
        if not user:
            return make_response("No user found", 404, 'text/plain')
        session.delete(user)
        session.commit()
        session.close()
        return Response(status=204)
