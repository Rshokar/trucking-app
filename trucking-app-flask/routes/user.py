from flask import Blueprint, request
from controllers.user_controller import UserController
user = Blueprint("user", __name__)


@user.route("/<int:id>", methods=["GET"])
def GET(id):
    return UserController.GET(request, id)


@user.route("/", methods=["POST"])
def POST():
    return UserController.POST(request)


@user.route("/<int:id>", methods=["PUT"])
def PUT(id):
    return UserController.PUT(request, id)


@user.route("/<int:id>", methods=["DELETE"])
def DELETE(id):
    return UserController.DELETE(request, id)
