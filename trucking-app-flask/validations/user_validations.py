account_validation = {
    "type": "object",
    "properties": {
        "company_name": {"type": "string"},
        "email": {
            "type": "string",
            "format": "email"
        },
    },
    "required": ["company_name", "email"],
    "additionalProperties": False
}
