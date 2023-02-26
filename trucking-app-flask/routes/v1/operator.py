from flask import Blueprint
from controllers.operator_controller import OperatorController

operator = Blueprint("operator", __name__)

@operator.route("/", methods=["GET"])


def GET():
    return operatorController.GET()


@operator.route("/", methods=["POST"])
def POST():
    return operatorController.POST()


@operator.route("/", methods=["PUT"])
def PUT():
    return operatorController.PUT()


@operator.route("/", methods=["DELETE"])
def DELETE():
    return operatorController.DELETE()
