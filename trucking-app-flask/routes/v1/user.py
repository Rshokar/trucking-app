from flask import jsonify, request, Blueprint, g
from sqlalchemy.exc import IntegrityError
from controllers import UserController
from models import User

user = Blueprint('user', __name__)
# GET operation (get user by ID)


# GET operation (get user by ID)
@user.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    session = g.session
    return UserController.get_user(session=session, user_id=user_id)


# POST operation (create a new user)
@user.route('/', methods=['POST'])
def create_user():
    session = g.session
    return UserController.create_user(session, request=request)


# PUT operation (update user by ID)
@user.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    session = g.session
    return UserController.update_user(session=session, request=request, user_id=user_id)

# DELETE operation (delete user by ID)


@user.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    session = g.session
    return UserController.delete_user(session=session, user_id=user_id)

