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
