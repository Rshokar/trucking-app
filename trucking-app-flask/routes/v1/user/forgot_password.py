from flask import jsonify, request, Blueprint, g, make_response
import jsonschema
from controllers import UserController
from validations import forgot_passwrod_email

# Create a blueprint for the forgot password related routes
forgot_password = Blueprint('forgot_password', __name__)

# Route to handle sending of the reset code to user's email


@forgot_password.route("/send_code", methods=['POST'])
def send_code():
    """
    Endpoint to send a six-digit reset code to the user's registered email.

    Expected JSON Request Body:
    {
        "email": "user@example.com"
    }

    Returns:
    {
        "message": "Code sent successfully to user@example.com",
        "status": "success"
    }
    OR
    {
        "message": "Error sending the code to user@example.com",
        "status": "failure"
    }
    """
    try:
        jsonschema.validate(request.json, forgot_passwrod_email)
        print(request.json)
        return make_response("JMELL", 200)
    except jsonschema.ValidationError as e:
        return make_response(str(e), 400)

# Route to handle validation of the reset code entered by the user


@forgot_password.route("/validate_code", methods=['POST'])
def validate_code():
    """
    Endpoint to validate the six-digit reset code entered by the user.

    Expected JSON Request Body:
    {
        "email": "user@example.com",
        "code": "123456"
    }

    Returns:
    {
        "message": "Code validated successfully",
        "status": "success",
        "token": "a_secure_token_string"
    }
    OR
    {
        "message": "Invalid code entered",
        "status": "failure"
    }
    """
    ...

# Route to handle the password reset action after code validation


@forgot_password.route('/reset_password', methods=['POST'])
def reset_password():
    """
    Endpoint to reset the user's password after successful code validation.

    Expected JSON Request Body:
    {
        "email": "user@example.com",
        "new_password": "newSecurePassword123",
        "token": "a_secure_token_string"
    }

    Returns:
    {
        "message": "Password reset successfully",
        "status": "success"
    }
    OR
    {
        "message": "Error resetting the password",
        "status": "failure"
    }
    """
    ...
