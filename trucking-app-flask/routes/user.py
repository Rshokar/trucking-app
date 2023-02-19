from flask import jsonify, request, Blueprint, g
from sqlalchemy.exc import IntegrityError
from config.db import Session
from models.user import User

user = Blueprint('user', __name__)
# GET operation (get user by ID)


# GET operation (get user by ID)
@user.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    session = g.session
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify(user.to_dict()), 200

# POST operation (create a new user)


@user.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    session = g.session
    try:
        user = User(type=data['type'], email=data['email'],
                    password=data['password'])
        session.add(user)
        session.commit()
        return jsonify(user.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except IntegrityError as e:
        return jsonify({"error": "Email already used."}), 409

# PUT operation (update user by ID)


@user.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    session = g.session
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json()
    try:
        user.type = data['type']
        user.email = data['email']
        user.password = data['password']
        session.commit()
        return jsonify(user.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except IntegrityError as e:
        return jsonify({"error": "Email already used."}), 409

# DELETE operation (delete user by ID)


@user.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    session = g.session
    user = session.query(User).filter_by(id=user_id).first()
    if not user:
        return jsonify({"error": "User not found."}), 404

    # remove the user object from the database
    session.delete(user)
    session.commit()

    # return a success message
    return jsonify({"message": "User deleted successfully."}), 200
