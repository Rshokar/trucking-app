# Define the JSON schema for the request data
dispatch_validation = {
    "type": "object",
    "properties": {
        "company_id": {"type": "integer", "minimum": 1},
        "customer_id": {"type": "integer", "minimum": 1},
        "notes": {"type": "string", "maxLength": 1000},
        "date": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2}$"},
    },
    "required": ["company_id", "customer_id", "notes", "date"],
    "additionalProperties": False
}


dispatch_update = {
    "type": "object",
    "properties": {
        "notes": {"type": "string", "maxLength": 1000},
        "date": {"type": "string", "pattern": "^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}$"},
    },
    "required": ["notes", "date"],
    "additionalProperties": False
}
