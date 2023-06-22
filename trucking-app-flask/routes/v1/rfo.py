from flask import Blueprint, request, g
from datetime import datetime
from controllers.rfo_controller import RfoController
from validations import rfo_update, rfo_validation
from utils import make_response
from flask_login import login_required
import jsonschema


rfo = Blueprint("rfo", __name__)


@rfo.route("/", methods=["GET"])
@login_required
def GET_ALL():
    # Getquery string parameter and replae with default
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 0))
    dispatch_id = request.args.get('dispatch_id')
    return RfoController.get_all_rfo(g.session, limit, page, dispatch_id)


@rfo.route("/<int:rfo_id>", methods=["GET"])
@login_required
def GET(rfo_id):
    return RfoController.get_rfo(g.session, rfo_id)


@rfo.route("/", methods=["POST"])
@login_required
def create_rfo():
    session = g.session
    try:
        jsonschema.validate(request.json, rfo_validation)
        return RfoController.create_rfo(request=request, session=session)
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": e.message}, 400)


@rfo.route("/<int:rfo_id>", methods=["PUT"])
@login_required
def edit_rfo(rfo_id):
    session = g.session
    try:
        jsonschema.validate(request.json, rfo_update)
        return RfoController.update_rfo(session, request, rfo_id)
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": e.message}, 400)


@rfo.route("/<int:rfo_id>", methods=["DELETE"])
@login_required
def delete_rfo(rfo_id):
    return RfoController.delete_rfo(g.session, rfo_id)
