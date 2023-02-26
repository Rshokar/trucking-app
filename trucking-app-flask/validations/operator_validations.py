operator_validation = {
    "type": "object",
    "properties": {
        "company_id": {"type": "integer"},
        "operator_name": {"type": "string", "minLength": 2},
        "operator_email": {"type": "string", "format": "email"}
    },
    "required": ["company_id", "operator_name", "operator_email"]
}