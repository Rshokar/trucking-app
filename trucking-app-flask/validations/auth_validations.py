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
        "role": {"type": "string"},
        "company": {"type": "string"},
        "user_id": {"type": "string"},
    },
    "required": ["company", "user_id"],
    "additionalProperties": False
}
