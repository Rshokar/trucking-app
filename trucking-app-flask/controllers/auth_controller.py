from flask import g, make_response
from models import User, Company
from firebase_admin import auth
from .stripe_controller import StripeController
from .user_controller import UserController


class AuthController:

    @staticmethod
    def register(session, request):
        """
        Register a new user and company.

        Checks if the user already exists in Firebase. If they do, return 400.
        If not, create the user in Firebase. Subsequently, register the user and
        the associated company in the local database. Return the user and company data.

        It is assumed that the email, password, and company name are validated 
        and exist in the request payload.

        Args:
            session (Session): A session object to manage database operations.
            request (Request): The Flask request object containing client's request data.

        Returns:
            Response: A Flask response object.
        """

        # Extract registration data from the request.
        token = request.json.get("token")
        company_name = request.json.get("company")

        try:
            # Decode and verify Firebase JWT
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token.get("uid")
            email = decoded_token.get("email")
            
            # At this point we want to see if that user is already in the system
            user = session.query(User).filter_by(id=uid).first()
            
            if user is not None: 
                return make_response("User already exist", 403)
            
            # Once we now the user does not exist in our system
            # we can create a stripe user and then add them to the db. 
            customer_id = StripeController.add_customer(company_name=company_name, email=email)
            # Create user and company DB
            
            user = User(id=uid, stripe_id=customer_id)
            session.add(user)
            company = Company(name=company_name, owner_id=uid)
            session.add(company)

            session.commit()

            response = make_response({
                "user": user.to_dict(),
                "company": company.to_dict()
            }, 200)

            # Set the JWT in HttpOnly cookie for added security
            response.set_cookie('access_token', token, httponly=True)
            print(decoded_token)
            g.user = decoded_token
            UserController.send_validation_email(session)
            
            return response

        except Exception as e:
            return make_response(str(e), 500)

    @staticmethod
    def login(session, request):
        """
        Verifies Firebase's ID token sent from the client-side after successful authentication.
        If the token is invalid or expired, return 401.
        If successful, insert access token in cookies and return 200.

        Args:
            session (Session): A session object to manage database operations.
            request (Request): The Flask request object containing request data.
        """

        id_token = request.json.get("id_token")

        try:
            # Verify the ID token
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token.get("uid")

            # (Optional) Check if the user exists in your database if needed.
            user = session.query(User).filter_by(id=uid).first()
            company = session.query(Company).filter_by(owner_id=uid).first()

            print(uid)
            print(user)
            print(company)

            if not user or not company:
                return make_response("User not found in our records", 404)

            response = make_response({
                "company": company.to_dict(),
                "user": user.to_dict(),
            }, 200)

            # If you want, you can set some cookies or headers here.
            response.set_cookie('access_token', id_token)

            return response

        except auth.ExpiredIdTokenError:
            return make_response("Token has expired", 401)

        except auth.InvalidIdTokenError:
            return make_response("Invalid token", 401)

        except Exception as e:
            print(e)
            return make_response(str(e), 500)

    @staticmethod
    def re_auth(request):
        """
        Validates the JWT token provided in the request body and, if valid, sets it as an
        http-only cookie named 'access_token' for subsequent requests.

        Args:
            request (Request): The Flask request object containing client's request data.

        Returns:
            Response: A Flask response object. If successful, it contains a set-cookie header
                      for the access_token. Otherwise, an error message is returned.
        """
        id_token = request.json.get("id_token")

        try:
            # Verify the ID token using Firebase Admin SDK
            auth.verify_id_token(id_token)

            # Construct a successful response
            response = make_response("Set Cookie", 200)

            # Set the verified ID token in the cookies as 'access_token'
            response.set_cookie('access_token', id_token, httponly=True)

            return response

        except auth.ExpiredIdTokenError:
            return make_response("Token has expired", 403)

        except auth.InvalidIdTokenError:
            return make_response("Invalid token", 400)

        except Exception as e:
            return make_response(str(e), 500)

    @staticmethod
    def logout():
        """
        Log out a user by revoking their Firebase ID token and removing their cookies.

        Args:
            session (Session): A session object to manage database operations.
            request (Request): The Flask request object containing request data.

        Returns:
            Response: A Flask response object indicating the result of the logout action.
        """
        try:
            # Revoke the token
            auth.revoke_refresh_tokens(g.user['uid'])

            response = make_response("Logged out successfully", 200)

            # Remove the cookies
            response.delete_cookie('access_token')

            return response

        except Exception as e:
            print(e)
            return make_response(str(e), 500)
