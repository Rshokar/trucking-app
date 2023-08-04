from flask import Response, g, request
from models import User, Company
from utils import make_response
from flask_login import login_user, logout_user
from sqlalchemy.exc import IntegrityError
from datetime import timedelta


class AuthController:

    def login(session, request):
        """Authenticates a user

        Args:
            session (_type_): _description_
            request (_type_): _description_

        Returns:
            Response: 200 success
        """
        request_data = request.get_json()

        print("REQUEST DATA: ", request_data)
        email = request_data.get('email')
        password = request_data.get('password')

        user = session.query(User).filter_by(email=email.lower()).first()

        print(user)

        if not user or not user.check_password(password):
            return make_response({"error": 'Invalid username or password'}, 401)

        login_user(user, remember=True, duration=timedelta(days=2))

        print("USER FROM LOGIN: ", user.to_dict())

        comp = session.query(Company).filter_by(owner_id=user.id).first()

        print("COMPANY FROM LOGIN: ", comp)
        return make_response({
            "user": user.to_dict(),
            "company": comp.to_dict()
        }, 200)

    def logout():
        logout_user()
        return make_response({"message": "Logout successful"}, 200)

    def register(session, request):
        """_summary_
            Checks if the user is already registered, if not,
            creates a new user and there company.
        Args:
            session (_type_): _description_
            request (_type_): _description_
        """
        data = request.get_json()

        existingUser = session.query(User).filter_by(
            email=data.get('email').lower()).first()
        if existingUser:
            return make_response({"error": "Email already used."}, 409)

        try:
            user = User(role=data.get("role"), email=data.get(
                'email'), password=data.get('password'))
            session.add(user)
            session.commit()

            company = Company(name=data.get('company'), owner_id=user.id)
            session.add(company)
            session.commit()

            combined_dict = {
                "user": user.to_dict(), "company": company.to_dict()}

            return make_response(combined_dict, 201)

        except ValueError as e:
            return make_response({"error": str(e)}, 400)
        except IntegrityError as e:
            return make_response({"error": "Email already used."}, 409)
