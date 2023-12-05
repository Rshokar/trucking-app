from models import ContactMethods

operator_validation = {
    "type": "object",
    "properties": {
        "company_id": {"type": "integer"},
        "operator_name": {"type": "string", "minLength": 2},
        "operator_email": {
            "type": "string",
            "pattern": "^([a-z\\d\\.-_-]+)@([a-z\\d-]+)([\\.])([a-z]{2,6})(\\.[a-z]{2,6})?$"
        },
        "contact_method": {
            "type": "string",
            "enum": ["sms", "email"] 
        },
        "operator_phone": {
            "type": "string",
            "pattern": "^[+]?[0-9]{10,15}$"
        },
        "operator_phone_country_code": {
            "type": "string",
            "minLength": 1,
            "maxLength": 4
        }
    },
    "required": ["company_id", "operator_name", "contact_method"],
    "additionalProperties": False
}


operator_update = {
    "type": "object",
    "properties": {
        "operator_name": {"type": "string", "minLength": 2},
        "operator_email": {
            "type": ["string", "null"],
            "pattern": "^([a-z\\d\\.-_-]+)@([a-z\\d-]+)([\\.])([a-z]{2,6})(\\.[a-z]{2,6})?$", 
            "optional": True
        },
        "contact_method": {
            "type": "string",
            "enum": ["sms", "email"] 
        },
        "operator_phone": {
            "type": ["string", "null"],
            "pattern": "^[+]?[0-9]{10,15}$"
        },
        "operator_phone_country_code": {
            "type": ["string", "null"],
            "minLength": 1,
            "maxLength": 4
        }
    },
    "required": ["company_id", "operator_name", "contact_method"],
}
