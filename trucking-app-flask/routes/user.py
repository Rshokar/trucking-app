from flask import Blueprint, request
from controllers.user_controller import UserController

user = Blueprint("user", __name__)


@user.route("/", methods=["GET"])
def GET():
    return UserController.GET(request)


@user.route("/", methods=["POST"])
def POST():
    return UserController.POST(request)


@user.route("/", methods=["PUT"])
def PUT():
    return UserController.PUT(request)


@user.route("/", methods=["DELETE"])
def DELETE():
    return UserController.DELETE(request)
