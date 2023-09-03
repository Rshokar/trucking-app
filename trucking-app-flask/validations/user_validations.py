account_validation = {
    "type": "object",
    "properties": {
        "company_name": {"type": "string"},
        "email": {
            "type": "string",
            "format": "email"
        },
    },
    "additionalProperties": False
}

forgot_passwrod_email = {
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "format": "email"
        },
    },
    "additionalProperties": False
}

validate_forgot_password_code = {
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "format": "email"
        },
        "code": {
            "type": "string",
            # regex to ensure the token is exactly 6 digits
            "pattern": "^[0-9]{6}$"
        },
    },
    "required": ["email", "code"],  # both email and token are required
    "additionalProperties": False
}


forgot_password_reset_password = {
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "format": "email"
        },
        "token": {
            "type": "string",
            # regex to capture a typical JWT-like structure; can be adjusted if needed
            "pattern": "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$"
        },
        "password": {
            "type": "string",
            # regex to ensure the password is at least 8 characters long and contains both letters and numbers
            "pattern": "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
        }
    },
    # all three fields are required
    "required": ["email", "token", "password"],
    "additionalProperties": False
}
