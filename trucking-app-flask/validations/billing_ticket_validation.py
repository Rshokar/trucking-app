billing_ticket_validation = {
    "type": "object",
    "properties": {
        "bill_id": {"type": "integer"},
        "rfo_id": {"type": "integer"},
        "ticket_number": {"type": "integer"},
        "image_id": {"type": "integer"}
    },
    "required": ["bill_id", "rfo_id", "ticket_number"],
    "additionalProperties": False
}
