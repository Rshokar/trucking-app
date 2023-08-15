from flask import Response, g, request, make_response
from models import User, Company


class AuthController:

    def register(session, request):
        """_summary_
            Checks if the user is already registered, if not,
            creates a new user and there company.
        Args:
            session (_type_): _description_
            request (_type_): _description_
        """
        data = request.get_json()

        # existingUser = session.query(User).filter_by(
        #     email=data.get('email').lower()).first()
        # if existingUser:
        #     return make_response({"error": "Email already used."}, 409)

        try:
            user = User(id=data.get('user_id'))
            session.add(user)
            session.commit()

            company = Company(name=data.get('company'), owner_id=user.id)
            session.add(company)
            session.commit()

            combined_dict = {
                "user": user.to_dict(), "company": company.to_dict()}

            return make_response(combined_dict, 201)

        except ValueError as e:
            return make_response(str(e), status=400)
