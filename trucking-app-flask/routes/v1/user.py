from flask import jsonify, request, Blueprint, g
import jsonschema
from sqlalchemy.exc import IntegrityError
from controllers import UserController
from flask_login import login_required, current_user
from models import User
from utils import make_response
from validations import account_validation


user = Blueprint('user', __name__)
# GET operation (get user by ID)


# GET operation (get user by ID)
@user.route('/<int:user_id>', methods=['GET'])
@login_required
def get_user(user_id):
    if current_user.id != user_id:
        return jsonify({"error": "You are not authorized to view this user"}), 403

    session = g.session
    return UserController.get_user(session=session, user_id=user_id)


# POST operation (create a new user)
@user.route('/', methods=['POST'])
def create_user():
    session = g.session
    return UserController.create_user(session, request=request)


# PUT operation (update user by ID)
@user.route('/<int:user_id>', methods=['PUT'])
@login_required
def update_user(user_id):
    if current_user.id != user_id:
        return jsonify({"error": "You are not authorized to update this user"}), 403
    session = g.session
    return UserController.update_user(session=session, request=request, user_id=user_id)

# DELETE operation (delete user by ID)


@user.route('/<int:user_id>', methods=['DELETE'])
@login_required
def delete_user(user_id):
    if current_user.id != user_id:
        return jsonify({"error": "You are not authorized to delete this user"}), 403
    session = g.session
    return UserController.delete_user(session=session, user_id=user_id)


@user.route('/account', methods=["PUT"])
@login_required
def update_profile():
    print(request.json)
    try:
        jsonschema.validate(request.json, account_validation)
        return UserController.update_account(request=request, session=g.session)
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": e.message}, 400)
