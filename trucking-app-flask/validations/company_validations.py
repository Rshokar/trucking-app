new_company_schema = {
    "type": "object",
    "properties": {
        "owner_id": {"type": "integer"},
        "company_name": {"type": "string", "maxLength": 200}
    },
    "required": ["owner_id", "company_name"],
    "additionalProperties": False
}
