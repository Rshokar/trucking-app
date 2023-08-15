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
            "maxLength": 300,
            "minLength": 2
        },
        "start_time": {
            "type": "string",
            "format": "date-time",
            "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}",
        },
        "dump_location": {
            "type": "string",
            "maxLength": 500,
            "minLength": 2,
        },
        "load_location": {
            "type": "string",
            "maxLength": 500,
            "minLength": 2,
        }
    },
    "required": ["dispatch_id", "operator_id", "trailer", "truck", "start_location", "start_time", "dump_location", "load_location"],
    "additionalProperties": False
}


rfo_update = {
    "type": "object",
    "properties": {
        "operator_id": {
            "type": "integer",
            "minimum": 1,
        },
        "trailer": {
            "type": "string",
            "maxLength": 100,
            "minLength": 2
        },
        "truck": {
            "type": "string",
            "maxLength": 100,
            "minLength": 2
        },
        "start_location": {
            "type": "string",
            "maxLength": 300,
            "minLength": 2
        },
        "start_time": {
            "type": "string",
            "format": "date-time",
            "pattern": "^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}",
        },
        "dump_location": {
            "type": "string",
            "maxLength": 500,
            "minLength": 2,
        },
        "load_location": {
            "type": "string",
            "maxLength": 500,
            "minLength": 2,
        }
    },
    "required": ["operator_id", "trailer", "truck", "start_location", "start_time", "dump_location", "load_location"],
    "additionalProperties": True
}
