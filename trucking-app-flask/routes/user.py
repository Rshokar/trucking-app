from flask import Blueprint, jsonify
from controllers.user_controller import UserController

user = Blueprint("user", __name__)


@user.route("/", methods=["GET"])
def GET():
    return UserController.GET()


@user.route("/", methods=["POST"])
def POST():
    return UserController.POST()


@user.route("/", methods=["PUT"])
def PUT():
    return UserController.PUT()


@user.route("/", methods=["DELETE"])
def DELETE():
    return UserController.DELETE()
