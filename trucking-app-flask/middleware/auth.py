import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from flask import request, g, make_response
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, '../firebasekey.json')
cred = credentials.Certificate(KEY_PATH)
firebase_admin.initialize_app(cred)


def firebase_required(fn):
    """
    Middleware to validate the Firebase ID token present in cookies.
    If valid, the user information is added to Flask's g object for subsequent use.
    If the token is missing or invalid, returns a 401 Unauthorized response.

    Args:
        fn (function): The decorated endpoint function.

    Returns:
        function: The result of the endpoint function if validation succeeds, 
                  or a 401 Unauthorized response if validation fails.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # Retrieve the ID token from cookies
        id_token = request.cookies.get("access_token")

        # print(f"ID TOKEN {id_token}")

        # If token is missing
        if not id_token:
            return make_response("Authentication token missing", 401)

        try:
            # Verify the ID token with Firebase
            user = auth.verify_id_token(id_token)
            # Save the user data in Flask's g object for subsequent processing
            g.user = user

        except auth.ExpiredIdTokenError:
            return make_response("Authentication token has expired", 401)
        except auth.InvalidIdTokenError as e:
            print(e)
            return make_response("Invalid authentication token", 401)
        except Exception as e:
            print(e)  # Log the exception for debugging
            return make_response("Authentication failed", 401)

        # Continue processing the original request
        return fn(*args, **kwargs)

    return wrapper
