from itsdangerous import BadTimeSignature, SignatureExpired, URLSafeTimedSerializer
from models import User, Company
from utils import make_response
from sqlalchemy.exc import IntegrityError, OperationalError
from flask import g, current_app as app
from firebase_admin import auth, exceptions
from flask_mail import Mail
from models import User
import os
from firebase_admin import auth
from random import randint
from utils import send_user_forgot_password_code

SEND_USER_FORGOT_PASSWORD_EMAIL_SECRET = os.environ.get(
    "SEND_USER_FORGOT_PASSWORD_EMAIL_SECRET")


class UserController:
    def get_user(session, user_id):
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return make_response("User not found.", 404)
        return make_response(user.to_dict(), 200)

    def create_user(session, request):
        data = request.get_json()

        print(data)
        try:
            user = User(role=data['role'], email=data['email'],
                        password=data['password'])
            session.add(user)
            session.commit()
            return make_response(user.to_dict(), 200)
        except ValueError as e:
            return make_response(str(e), 400)
        except IntegrityError as e:
            return make_response("Email already used.", 409)

    def update_user(session, request, user_id):
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return make_response("User not found.", 404)

        data = request.get_json()
        try:
            user.role = data.get('role', user.role)
            user.email = data.get('email', user.email)
            session.commit()
            return make_response(user.to_dict(), 200)
        except ValueError as e:
            return make_response(str(e), 400)
        except IntegrityError as e:
            return make_response("Email already used.", 409)
        except OperationalError as e:
            print(f"ERROR: {e}")

    def delete_user(session, user_id):
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return make_response("User not found.", 404)

        # remove the user object from the database
        session.delete(user)
        session.commit()

        # return a success message
        return make_response("User deleted successfully.", 200)

    def update_account(request, session):
        """_summary_
            This end point is responsible for updated user email,
            copmany name, and user password
        Args:
            request (_type_): _description_
            session (_type_): _description_
        """
        data = request.get_json()
        email = data.get('email', None)
        company_name = data.get('company_name', None)

        if email is not None:
            try:
                user = user = auth.get_user(g.user['uid'])
                if (user.email != email):
                    auth.update_user(g.user['uid'], email=email)
            except exceptions.NotFoundError as e:
                return make_response("User not found", 400)
            except exceptions.AlreadyExistsError as e:
                return make_response("Email already in use", 400)

        if company_name is not None:
            company = session.query(Company).filter_by(
                owner_id=g.user['uid']).first()
            if not company:
                return make_response("Company not found.", 404)
            try:
                company.company_name = company_name
                session.commit()
            except ValueError as e:
                return make_response(str(e), 400)
            except OperationalError as e:
                return make_response("There was an errors", 500)

        return make_response("Account updated successfully.", 200)

    @staticmethod
    def send_forgot_password_code(session, request):
        # Ensure email is provided
        error_message = "If your email was found we will send an email"

        email = request.json["email"].lower()

        # Check if the email exists in Firebase users
        try:
            firebase_user = auth.get_user_by_email(email)
        except exceptions.FirebaseError:
            return make_response(error_message, 200)

        # Fetch user from our DB using the Firebase UID
        user = session.query(User).filter_by(id=firebase_user.uid).first()
        if not user:
            return make_response(error_message, 200)

        # Generate six-digit code
        code = str(randint(100000, 999999))

        # Store the six-digit code in DB
        user.reset_code = code
        session.commit()

        # Send the email with the code
        send_user_forgot_password_code(Mail(app), email, code)

        return make_response(error_message, 200)
