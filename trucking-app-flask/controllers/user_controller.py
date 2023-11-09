from itsdangerous import BadTimeSignature, SignatureExpired, URLSafeTimedSerializer
from models import User, Company
from utils import make_response
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy import and_
from flask import g, current_app as app
from firebase_admin import auth, exceptions
from flask_mail import Mail
from models import User
import os
from firebase_admin import auth
from random import randint
from utils import send_user_forgot_password_code
from datetime import datetime
from utils import send_email_verification
from random import randint


RESET_PASSWORD_SECRET = os.environ.get(
    "RESET_PASSWORD_SECRET")

RESET_PASSWORD_SALT = os.environ.get('RESET_PASSWORD_SALT')
VALIDATE_EMAIL_SECRET = os.environ.get('VALIDATE_EMAIL_SECRET')


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
    def validate_email(session, token):
        """_summary_
            This function will check to see if the token is found in our 
            db and has not expired. 

            Token will be valid for only ten minuetes
        Args:
            session (_type_): _description_
            token (_type_): _description_

        Returns:
            _type_: _description_
        """

        if token is None:
            return make_response('Token is required', 404)
        s = URLSafeTimedSerializer(VALIDATE_EMAIL_SECRET)

        try:
            data = s.loads(token)
        except SignatureExpired as e:
            print(e)
            return make_response('Token expired.', 400)
        except BadTimeSignature as e:
            print(e)
            return make_response('Invalid token.', 400)

    @staticmethod
    def send_validation_email(session):
        """
        Send a validation email to the currently authenticated user.

        Steps:
        - If the user is already validated, return 200.
        - If the email is sent successfully, return a 202 status.
        - In case the token is missing, return a 404.
        - Generates a random token, saves it in the database, and includes it in the email.
        - Ensures that the token's consumed state is set to False.

        Args:
            session (Session): SQLAlchemy session object.

        Returns:
            Response: Flask response object with an appropriate status and message.
        """
        # Query to check if the user is already validated

        user = session.query(User)\
            .filter(and_(User.id == g.user['uid'], User.email_validated == False)).first()

        if user is None:
            return make_response("User not found validated", 404)
        
        # Generate email validation token with random code
        random_code = ''.join([str(randint(0, 9)) for _ in range(6)])
        s = URLSafeTimedSerializer(VALIDATE_EMAIL_SECRET)
        token = s.dumps({'user_id': g.user["uid"], 'code': random_code})

        # Send email verification

        mail = Mail(app)
        try:
            send_email_verification(mail, g.user['email'], token)
        except Exception as e:
            app.logger.error(f"Error sending email: {e}")
            return make_response("Error sending email", 500)

        # Update user information with the generated token and set its consumed state
        user.email_validation_token = random_code
        user.email_validation_token_consumed = False
        session.commit()

        return make_response("Email sent", 202)

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

        # If the user has a code that's not expired, we can avoid regenerating and resending
        if user.reset_code and not user.check_token_expiration():
            return make_response(error_message, 200)

        # Generate six-digit code
        code = str(randint(100000, 999999))

        # Store the six-digit code in DB and set the creation time
        user.reset_code = code
        user.code_created_at = datetime.utcnow()
        session.commit()

        # Send the email with the code
        send_user_forgot_password_code(Mail(app), email, code)

        return make_response(error_message, 200)

    @staticmethod
    def validate_forgot_password_code(session, request):
        """
        Validates the six-digit reset code and returns a token if the code is valid.
        """

        # Extract email and code from request
        email = request.json["email"].lower()
        code = request.json["code"]

        # Check if the email exists in Firebase users and get the UID
        try:
            firebase_user = auth.get_user_by_email(email)
        except exceptions.FirebaseError:
            return make_response("Invalid code entered", 400)

        # Fetch user from our DB using the Firebase UID and the provided code
        user = session.query(User).filter_by(
            id=firebase_user.uid, reset_code=code).first()
        if not user:
            return make_response("Invalid code entered", 400)

        # Check the token expiration
        if user.check_token_expiration():
            return make_response("Code has expired", 400)

        # Generate secure token for the user to reset their password
        s = URLSafeTimedSerializer(RESET_PASSWORD_SECRET)
        token = s.dumps(email, salt=RESET_PASSWORD_SALT)

        # Store the generated token in the DB
        user.reset_code = None
        user.code_created_at = None
        user.recovery_token = token
        print(user)
        session.commit()

        return make_response(token, 200)

    @staticmethod
    def forgot_password_update_password(session, request):
        """
        Updates the user's password after successful token validation.
        """

        # Extract email, token, and new password from request
        email = request.json["email"].lower()
        token = request.json["token"]
        new_password = request.json["password"]

        # Check if the email exists in Firebase users and get the UID
        try:
            firebase_user = auth.get_user_by_email(email)
        except exceptions.FirebaseError:
            return make_response("Error resetting the password", 400)

        # Fetch user from our DB using the Firebase UID and the provided token
        user = session.query(User).filter_by(
            id=firebase_user.uid, recovery_token=token).first()
        if not user:
            return make_response("Error resetting the password", 400)

        # Validate the token using the URLSafeTimedSerializer
        s = URLSafeTimedSerializer(RESET_PASSWORD_SECRET)
        try:
            # This will throw an error if the token is bad or expired
            # Assuming the token is valid for 5 min
            s.loads(token, salt=RESET_PASSWORD_SALT, max_age=300)
        except (BadTimeSignature, SignatureExpired):
            return make_response("Token expired, please try again.", 400)

        # Update password in Firebase
        try:
            auth.update_user(firebase_user.uid, password=new_password)
        except exceptions.FirebaseError:
            return make_response("Error updating the password", 400)

        # Clear the recovery token and related fields in our DB
        user.recovery_token = None
        user.code_created_at = None
        session.commit()

        return make_response("Password reset successfully", 200)
