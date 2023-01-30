from flask import Blueprint
from controllers.dispatch_controller import DispatchController

dispatch = Blueprint("dispatch", __name__)


@dispatch.route("/", methods=["GET"])
def GET():
    return DispatchController.GET()


@dispatch.route("/", methods=["POST"])
def POST():
    return DispatchController.POST()


@dispatch.route("/", methods=["PUT"])
def PUT():
    return DispatchController.PUT()


@dispatch.route("/", methods=["DELETE"])
def DELETE():
    return DispatchController.DELETE()
