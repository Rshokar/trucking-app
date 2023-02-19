from flask import Blueprint
from controllers.rfo_controller import RfoController

rfo = Blueprint("rfo", __name__)



@rfo.route("/", methods=["GET"])
def GET():
    return RfoController.GET()


@rfo.route("/", methods=["POST"])
def POST():
    return RfoController.POST()


@rfo.route("/", methods=["PUT"])
def PUT():
    return RfoController.PUT()


@rfo.route("/", methods=["DELETE"])
def DELETE():
    return RfoController.DELETE()