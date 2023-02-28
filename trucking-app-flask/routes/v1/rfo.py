from flask import Blueprint, request, g
from controllers.rfo_controller import RfoController
from validations import rfo_validation
from utils import make_response
import jsonschema

rfo = Blueprint("rfo", __name__)


@rfo.route("/<int:rfo_id>", methods=["GET"])
def GET(rfo_id):
    return RfoController.GET()


@rfo.route("/", methods=["POST"])
def create_rfo():
    session = g.session
    print(f"RFO: {request.json}")
    try:
        jsonschema.validate(request.json, rfo_validation)
        return RfoController.create_rfo(request=request, session=session)
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": "Invalid Request Data"}, 400)


@rfo.route("/<int:rfo_id>", methods=["PUT"])
def edit_rfo():
    return RfoController.PUT()


@rfo.route("/<int:rfo_id>", methods=["DELETE"])
def DELETE():
    return RfoController.DELETE()
