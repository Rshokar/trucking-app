from models import User
from utils import make_response
from sqlalchemy.exc import IntegrityError, OperationalError


class UserController:
    def get_user(session, user_id):
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return make_response({"error": "User not found."}, 404)
        return make_response(user.to_dict(), 200)

    def create_user(session, request):
        data = request.get_json()

        print(data)
        try:
            user = User(role=data['role'], email=data['email'],
                        password=data['password'])
            session.add(user)
            session.commit()
            return make_response(user.to_dict(), 200)
        except ValueError as e:
            return make_response({"error": str(e)}, 400)
        except IntegrityError as e:
            return make_response({"error": "Email already used."}, 409)

    def update_user(session, request, user_id):
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return make_response({"error": "User not found."}, 404)
        print(f"BEFORE: {user}")

        data = request.get_json()
        try:
            user.role = data.get('role', user.role)
            user.email = data.get('email', user.email)
            print(f"AFTER: {user}")
            session.commit()
            return make_response(user.to_dict(), 200)
        except ValueError as e:
            return make_response({"error": str(e)}, 400)
        except IntegrityError as e:
            return make_response({"error": "Email already used."}, 409)
        except OperationalError as e:
            print(f"ERROR: {e}")

    def delete_user(session, user_id):
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return make_response({"error": "User not found."}, 404)

        # remove the user object from the database
        session.delete(user)
        session.commit()

        # return a success message
        return make_response({"message": "User deleted successfully."}, 200)
