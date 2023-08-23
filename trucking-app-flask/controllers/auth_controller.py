from flask import g, make_response
from models import User, Company
from firebase_admin import auth


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

            # Create user and company in local DB
            user = User(id=uid)
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
