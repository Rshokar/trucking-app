# Define the JSON schema for the request data
disptch_validation = {
    "type": "object",
    "properties": {
        "company_id": {"type": "integer"},
        "customer_id": {"type": "integer"},
        "notes": {"type": "string", "maxLength": 1000},
        "date": {"type": "string", "format": "date-time"},
    },
    "required": ["company_id", "customer_id", "notes", "date"],
}