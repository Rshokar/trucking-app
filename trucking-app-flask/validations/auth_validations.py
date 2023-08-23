auth_validation = {
    "type": "object",
    "properties": {
        "id_token": {"type": "string"},
    },
    "required": ["id_token"],
    "additionalProperties": False
}


register_validation = {
    "type": "object",
    "properties": {
        "token": {"type": "string"},
        "company": {
            "type": "string",
            "minLength": 3,  # since company name must be greater than 2 characters
            "maxLength": 50
        },
    },
    "required": ["company", "token"],
    "additionalProperties": False
}
