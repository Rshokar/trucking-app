from flask import Blueprint, g, jsonify, request
from models import Dispatch, Company, Customer
from datetime import datetime
from controllers import DispatchController
from validations import dispatch_validation
from utils import make_response
import jsonschema

dispatch = Blueprint("dispatch", __name__)


@dispatch.route('/<int:dispatch_id>', methods=['GET'])
def get_dispatch(dispatch_id):
    session = g.session
    return DispatchController.get_dispatch(session=session, dispatch_id=dispatch_id)
    


@dispatch.route('/', methods=['POST'])
def create_dispatch():
    session = g.session
    try:
        jsonschema.validate(request.json, dispatch_validation)
        return DispatchController.create_dispatch(session=session, request=request)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)

@dispatch.route('/<int:dispatch_id>', methods=['PUT'])
def update_dispatch(dispatch_id):
    session = g.session
    try: 
        jsonschema.validate(request.json, dispatch_validation)
        return DispatchController.update_dispatch(session=session, request=request, dispatch_id=dispatch_id)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)

@dispatch.route('/<int:dispatch_id>', methods=['DELETE'])
def delete_dispatch(dispatch_id):
    session = g.session
    return DispatchController.delete_dispatch(session, dispatch_id=dispatch_id)

