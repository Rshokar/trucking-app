from flask import Blueprint, g, jsonify, request
from models import Dispatch, Company, Customer
from datetime import datetime
from controllers import DispatchController
from validations import dispatch_validation, dispatch_update
from utils import make_response
from flask_login import login_required
import jsonschema

dispatch = Blueprint("dispatch", __name__)


@dispatch.route('/<int:dispatch_id>', methods=['GET'])
@login_required
def get_dispatch(dispatch_id):
    session = g.session
    return DispatchController.get_dispatch(session=session, dispatch_id=dispatch_id)


@dispatch.route('/', methods=['GET'])
@login_required
def get_dispatch_all():
    session = g.session

    # get query string parameters
    limit = request.args.get('limit')
    page = request.args.get('page')
    startDate = request.args.get('startDate')
    endDate = request.args.get('endDate')
    customers = request.args.getlist('customers')

    # pass query string parameters to DispatchController
    return DispatchController.get_dispatch_all(session=session, limit=limit, page=page, startDate=startDate, endDate=endDate, customers=customers)


@dispatch.route('/', methods=['POST'])
@login_required
def create_dispatch():
    session = g.session
    try:
        jsonschema.validate(request.json, dispatch_validation)
        return DispatchController.create_dispatch(session=session, request=request)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)


@dispatch.route('/<int:dispatch_id>', methods=['PUT'])
@login_required
def update_dispatch(dispatch_id):
    session = g.session
    try:
        jsonschema.validate(request.json, dispatch_update)
        return DispatchController.update_dispatch(session=session, request=request, dispatch_id=dispatch_id)
    except jsonschema.ValidationError:
        return make_response({"error": "Invalid Request Data"}, 400)


@dispatch.route('/<int:dispatch_id>', methods=['DELETE'])
@login_required
def delete_dispatch(dispatch_id):
    session = g.session
    return DispatchController.delete_dispatch(session, dispatch_id=dispatch_id)
