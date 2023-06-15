auth_validation = {
    "type": "object",
    "properties": {
        "email": {"type": "string"},
        "password": {"type": "string"},
    },
    "required": ["email", "password"],
    "additionalProperties": False
}


register_validation = {
    "type": "object",
    "properties": {
        "email": {"type": "string"},
        "password": {"type": "string"},
        "role": {"type": "string"},
        "company": {"type": "string"},
    },
    "required": ["email", "password", "role", "company"],
    "additionalProperties": False
}
