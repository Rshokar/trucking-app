from itsdangerous import URLSafeTimedSerializer
from models import Operator, Company
from sqlalchemy.exc import IntegrityError
from utils import make_response, send_verification_email
from flask_login import current_user
from sqlalchemy import and_
from flask import current_app as app
from flask_mail import Mail


s = URLSafeTimedSerializer('Your_secret_key')
SALT = 'email-confirm'


class OperatorController:

    def get_all_operators(session, limit, page):
        """_summary_
        Gets all operators according to the queries passed in
        Args:
            session (_type_): _description_
            limit: (int): Number of items to return
            page: (int): What off set of limit should i start at
        """
        operators = session.query(Operator)\
            .join(Company, Company.company_id == Operator.company_id)\
            .filter(Company.owner_id == current_user.id)\
            .limit(limit).offset(page * limit).all()

        operators_dict = [operator.to_dict() for operator in operators]

        return make_response(operators_dict, 200)

    def get_operator(session, operator_id):
        '''
        Search for an Operator using their uniquely identifying ID

        Parameters:
            Session (session): SQLAlchemy db session
            operator_id (int): Integer that uniquely identifies an individual operator

        Returns:
            Responses: 200 OK if successful, 404 if not successful
        '''
        operator = Operator.get_operator_by_id_and_owner(
            session, operator_id, current_user.id)
        if operator is None:
            return make_response({'error': 'Operator not found.'}, 404)
        return make_response(operator.to_dict(), 200)  # 200 OK

    def create_operator(session, request):
        '''
        Create and add operator to db (if successful)

        Parameters:
            Session (session): SQLAlchemy db session
            request: API request

        Returns:
            Responses: 201 Created
        '''
        mail = Mail(app)
        req = request.get_json()
        company_id = req.get('company_id')
        name = req.get('operator_name')
        email = req.get('operator_email')

        company = session.query(Company).filter_by(
            company_id=company_id, owner_id=current_user.id).first()

        if company is None:
            return make_response(
                {"error": f"Company with ID {company_id} not found"}, 404)

        operator_email = session.query(Operator).filter_by(
            operator_email=email, company_id=company_id).first()
        if operator_email is not None:
            return make_response({'error': 'Operator email already used'}, 400)

        # Generate unique token for the operator
        token = s.dumps(email, salt=SALT)

        # Create operator
        new_operator = Operator(company_id=company_id,
                                operator_name=name, operator_email=email, confirmed=False, confirm_token=token)

        session.add(new_operator)
        session.commit()

        # Send verification email to the new operator
        send_verification_email(mail, email, token, name)

        return make_response(new_operator.to_dict(), 201)

    # Delete an operator
    def delete_operator(session, operator_id):
        '''
        Delete an operator (if successful)

        Parameters:
            Session (session): SQLAlchemy db session
            operator_id (int) : operator_id

        Returns:
            Responses: 201 Created
        '''
        operator = Operator.get_operator_by_id_and_owner(
            session, operator_id, current_user.id)

        if operator is None:
            return make_response({"error": "Operator not found"}, 404)

        try:
            session.delete(operator)
            session.commit()
            return make_response({"message": "Operator deleted successfully"}, 200)
        except IntegrityError:
            session.rollback()
            return make_response({"error": "Operator has tickets refrencing it, cannot be deleted"}, 400)

    def update_operator(session, request, operator_id):
        """
        Update an already existing operator in db (if found)

        Parameters:
            Session (session): SQLAlchemy database session
            Request (request): API Request
            operator_id (int): ID that uniquely identifies operator in database

        Return:
            Responses: 200 OK if successful, 404 if operator not found
        """
        req = request.get_json()
        email = req.get('operator_email')
        name = req.get("operator_name")

        operator = Operator.get_operator_by_id_and_owner(
            session, operator_id, current_user.id)

        # Return early if invalid operator id provided
        if operator is None:
            return make_response({'error': "Operator not found"}, 404)

        operator_email = session.query(Operator).filter(
            and_(
                Operator.operator_email == email,
                Operator.company_id == operator.company_id,
                Operator.operator_id != operator.operator_id
            )).first()

        if operator_email is not None:
            return make_response({'error': 'Operator email already used'}, 400)

        operator.operator_email = email
        operator.operator_name = name
        session.commit()

        return make_response(operator.to_dict(), 200)

    def validate_operator(session, token):
        '''
        Validates an operator's email

        Parameters:
            Session (session): SQLAlchemy db session
            token (str): Token string

        Returns:
            Responses: 200 OK if successful, 404 if operator not found, 400 if token is expired or invalid
        '''

        if token is None:
            return make_response({'error': 'Token required.'}, 404)
        try:
            # Change max_age as per your requirements
            email = s.loads(token, salt=SALT, max_age=3600)
        except:
            return make_response({'error': 'The confirmation link is invalid or has expired.'}, 400)

        operator = session.query(Operator).filter_by(
            operator_email=email).first()

        if operator is None:
            return make_response({'error': 'Operator not found.'}, 404)

        if operator.confirmed:
            return make_response({'error': 'Account already confirmed.'}, 200)

        operator.confirmed = True
        session.commit()

        return make_response({'message': 'You have confirmed your account. Thanks!'}, 200)
