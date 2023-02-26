from flask import Blueprint
from controllers.operator_controller import OperatorController

operators = Blueprint("operators", __name__)

@operators.route("/", methods=["GET"])


def GET():
    return OperatorController.GET()


@operators.route("/", methods=["POST"])
def POST():
    return OperatorController.POST()


@operators.route("/", methods=["PUT"])
def PUT():
    return OperatorController.PUT()


@operators.route("/", methods=["DELETE"])
def DELETE():
    return OperatorController.DELETE()
