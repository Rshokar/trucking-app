customer_validation = {
    "type": "object",
    "properties": {
        "customer_id": {
            "type": "integer"
        },
        "company_id": {
            "type": "integer"
        },
        "customer_name": {
            "type": "string",
            "maxLength": 200
        },
    },
    "required": ["customer_id", "company_id", "customer_name"]
}
