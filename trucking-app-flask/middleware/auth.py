import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from flask import request, g
from utils import make_response

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, '../firebasekey.json')

cred = credentials.Certificate(KEY_PATH)


# Initialize the Firebase admin SDK first
firebase_admin.initialize_app(cred)


def firebase_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        authHead = request.headers.get("Authorization-Fake-X", None)

        print(request.headers)
        if authHead is None:
            return make_response({"error": "Auth header missing"}, 401)

        id_token = authHead.split(" ")[1]

        try:
            # Check the token against firebase admin auth
            user = auth.verify_id_token(id_token)
            # Save user data in the Flask's g object
            g.user = user
        except Exception as e:
            print(e)
            return make_response({"error": "Authentication failed"}, 401)
        return fn(*args, **kwargs)
    return wrapper
