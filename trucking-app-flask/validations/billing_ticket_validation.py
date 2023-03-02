billing_ticket_validation = {
    "type": "object",
    "properties": {
        "rfo_id": {"type": "integer"},
        "ticket_number": {"type": "integer"},
        "image_id": {"type": "integer"}
    },
    "required": ["rfo_id", "ticket_number", "image_id"],
    "additionalProperties": False
}
