# Define the JSON schema for the request data
dispatch_validation = {
    "type": "object",
    "properties": {
        "company_id": {"type": "integer"},
        "customer_id": {"type": "integer"},
        "notes": {"type": "string", "maxLength": 1000},
        "date": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$"},
    },
    "required": ["company_id", "customer_id", "notes", "date"],
    "additionalProperties": False
}
