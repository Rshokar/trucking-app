company_validation = {
    "type": "object",
    "properties": {
        "owner_id": {"type": "integer"},
        "company_name": {"type": "string", "maxLength": 50, "minLength": 2}
    },
    "required": ["owner_id", "company_name"],
    "additionalProperties": False
}

company_update = {
    "type": "object",
    "properties": {
        "company_name": {"type": "string", "maxLength": 50, "minLength": 2}
    },
    "required": ["company_name"],
    "additionalProperties": False
}
