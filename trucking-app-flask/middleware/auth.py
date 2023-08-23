import firebase_admin
from itsdangerous import BadTimeSignature, SignatureExpired, URLSafeTimedSerializer
from firebase_admin import credentials, auth
from functools import wraps
from flask import request, g, make_response
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, '../firebasekey.json')
AUTHORIZATION_HEADER = os.environ.get("AUTHORIZATION_HEADER")
OPERATOR_ACCESS_TOKEN_SECRET = os.environ.get(
    "OPERATOR_ACCESS_TOKEN_SECRET"
)

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

        except auth.ExpiredIdTokenError as e:
            print(e)
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


def operator_auth(fn):
    """_summary_
        This middle ware will check for an access token
        in headers of the request. It will then unpack it 
        place it in the request as request.token.

        If access token is expired, inValid a 401 will be returned
    Args:
        fn (function): The decorated endpoint function

    Returns: 
        function: The results of the endpoint if validation success, 
            or a 401 Unauthorized response if validation fails.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # Retrieve the access_token from Authorization header
        auth_header_value = request.headers.get(AUTHORIZATION_HEADER)

        if auth_header_value is None:
            return make_response("Token not found", 400)

        split_header = auth_header_value.split(" ")

        if len(split_header) < 2:
            return make_response("Auth header values is malformed", 400)

        s = URLSafeTimedSerializer(OPERATOR_ACCESS_TOKEN_SECRET)

        try:
            # Token valid for 24 hours
            data = s.loads(split_header[1], max_age=86400)
        except SignatureExpired:
            return make_response('Token expired.', 400)
        except BadTimeSignature:
            return make_response('Invalid token.', 400)

        g.data = data

        # Continue processing the original request
        return fn(*args, **kwargs)

    return wrapper
