from flask import Response, g, request
from models import User
from utils import make_response
from flask_login import login_user
import jsonschema


class AuthController:

    def LOGIN(session, request):
        """Authenticates a user

        Args:
            session (_type_): _description_
            request (_type_): _description_

        Returns:
            Response: 200 success
        """
        request_data = request.get_json()
        email = request_data.get('email')
        password = request_data.get('password')

        user = session.query(User).filter_by(email=email).first()

        if not user or not user.check_password(password):
            return make_response('Invalid username or password', 401)

        login_user(user)

        return make_response('Login successful', 200)

    def LOGOUT():
        return Response(status=204)
