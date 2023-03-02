from flask import Blueprint, request, g
from controllers.rfo_controller import RfoController
from validations import rfo_update, rfo_validation
from utils import make_response
import jsonschema

rfo = Blueprint("rfo", __name__)


@rfo.route("/<int:rfo_id>", methods=["GET"])
def GET(rfo_id):
    return RfoController.get_rfo(g.session, rfo_id)


@rfo.route("/", methods=["POST"])
def create_rfo():
    session = g.session
    try:
        jsonschema.validate(request.json, rfo_validation)
        return RfoController.create_rfo(request=request, session=session)
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": e.message}, 400)


@rfo.route("/<int:rfo_id>", methods=["PUT"])
def edit_rfo(rfo_id):
    session = g.session
    try:
        jsonschema.validate(request.json, rfo_update)
        return RfoController.update_rfo(session, request, rfo_id)
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": e.message}, 400)


@rfo.route("/<int:rfo_id>", methods=["DELETE"])
def delete_rfo(rfo_id):
    return RfoController.delete_rfo(g.session, rfo_id)
