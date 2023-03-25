operator_validation = {
    "type": "object",
    "properties": {
        "company_id": {"type": "integer"},
        "operator_name": {"type": "string", "minLength": 2},
        "operator_email": {"type": "string", "pattern": "^([a-z\\d\\.-_-]+)@([a-z\\d-]+)([\\.])([a-z]{2,6})(\\.[a-z]{2,6})?$"}
    },
    "required": ["company_id", "operator_name", "operator_email"],
    "additionalProperties": False
}
