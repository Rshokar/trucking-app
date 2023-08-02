from models import User, Company
from utils import make_response
from sqlalchemy.exc import IntegrityError, OperationalError
from flask_login import current_user


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

        data = request.get_json()
        try:
            user.role = data.get('role', user.role)
            user.email = data.get('email', user.email)
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

    def update_account(request, session):
        """_summary_
            This end point is responsible for updated user email, 
            copmany name, and user password
        Args:
            request (_type_): _description_
            session (_type_): _description_
        """

        data = request.get_json()

        user = session.query(User).filter_by(id=current_user.get_id()).first()
        company = session.query(Company).filter_by(owner_id=user.id).first()

        if not user:
            return make_response({"error": "User not found."}, 404)

        if not company:
            return make_response({"error": "Company not found."}, 404)

        try:
            if 'email' in data:
                user.email = data['email']
            if 'company_name' in data:
                company.company_name = data['company_name']
            session.commit()
            return make_response({"message": "Account updated successfully."}, 200)
        except ValueError as e:
            return make_response({"error": str(e)}, 400)
        except IntegrityError as e:
            return make_response({"error": "Email or company name already used."}, 409)
        except OperationalError as e:
            print(f"ERROR: {e}")
