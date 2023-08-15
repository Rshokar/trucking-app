from flask import json, Response

DEFAULT_CONTENT_TYPE = 'application/json'


def make_response(data, status, content_type=DEFAULT_CONTENT_TYPE):
    res = json.dumps(data) if content_type == DEFAULT_CONTENT_TYPE else data
    return Response(res, status, mimetype=content_type)
