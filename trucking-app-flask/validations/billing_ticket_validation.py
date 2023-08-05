billing_ticket_validation = {
    "type": "object",
    "properties": {
        "rfo_id": {"type": "string", "minLength": 1},
        "ticket_number": {"type": "string", "maxLength": 50, "minLength": 2},
        "image_id": {"type": "string", "maxLength": 50, "minLength": 2}
    },
    "required": ["rfo_id", "ticket_number"],
    "additionalProperties": True
}


billing_ticket_upate = {
    "type": "object",
    "properties": {
        "ticket_number": {"type": "string", "maxLength": 50, "minLength": 2},
        "image_id": {"type": "string", "maxLength": 50, "minLength": 2}
    },
    "required": ["ticket_number", "image_id"],
    "additionalProperties": True
}
