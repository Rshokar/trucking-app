rfo_validation = {
    "type": "object",
    "properties": {
        "dispatch_id": {
            "type": "integer",
            "minimum": 1,
        },
        "operator_id": {
            "type": "integer",
            "minimum": 1,
        },
        "trailer": {
            "type": "string",
            "maxLength": 100
        },
        "truck": {
            "type": "string",
            "maxLength": 100
        },
        "start_location": {
            "type": "string",
            "maxLength": 300
        },
        "start_time": {
            "type": "string",
            "format": "date-time"
        },
        "dump_location": {
            "type": "string",
            "maxLength": 500
        },
        "load_location": {
            "type": "string",
            "maxLength": 500
        }
    },
    "required": ["dispatch_id", "operator_id", "trailer", "truck", "start_location", "start_time", "dump_location", "load_location"],
    "additionalProperties": False
}
