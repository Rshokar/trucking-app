customer_validation = {
    "type": "object",
    "properties": {
        "company_id": {
            "type": "integer"
        },
        "customer_name": {
            "type": "string",
            "maxLength": 50,
            "minLength": 2
        },
    },
    "required": ["company_id", "customer_name"]
}


customer_update = {
    "type": "object",
    "properties": {
        "deleted": {
            "type": "boolean"
        },
        "customer_name": {
            "type": "string",
            "maxLength": 50,
            "minLength": 2
        },
    },
    "required": ["customer_name"]
}
