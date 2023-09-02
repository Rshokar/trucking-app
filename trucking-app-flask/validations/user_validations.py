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
