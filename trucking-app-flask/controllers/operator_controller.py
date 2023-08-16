from itsdangerous import URLSafeTimedSerializer
from models import Operator, Company, RFO
from sqlalchemy.exc import IntegrityError
from utils import send_verification_email, send_operator_auth_token
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature

from sqlalchemy import and_
from flask import current_app as app, g, make_response
from flask_mail import Mail
import os

SEND_OPERATOR_RFO_TOKEN_SECRET = os.environ.get(
    "SEND_OPERATOR_RFO_TOKEN_SECRET")
OPERATOR_AUTH_TOKEN_SECRET = os.environ.get("OPERATOR_AUTH_TOKEN_SECRET")
OPERATOR_ACCESS_TOKEN_SECRET = os.environ.get(
    "OPERATOR_ACCESS_TOKEN_SECRET"
)

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
            .filter(Company.owner_id == g.user["uid"])\
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
            session, operator_id, g.user["uid"])
        if operator is None:
            return make_response('Operator not found.', 404)
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
            company_id=company_id, owner_id=g.user["uid"]).first()

        if company is None:
            return make_response(f"Company with ID {company_id} not found", 404)

        operator_email = session.query(Operator).filter_by(
            operator_email=email, company_id=company_id).first()
        if operator_email is not None:
            return make_response('Operator email already used', 400)

        # Create operator
        new_operator = Operator(company_id=company_id,
                                operator_name=name, operator_email=email, confirmed=False)

        session.add(new_operator)
        session.commit()

        # Generate unique token for the operator
        token = s.dumps({"operator_id": new_operator.operator_id}, salt=SALT)

        # Send verification email to the new operator
        send_verification_email(mail, email, token, name, company.company_name)

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
            session, operator_id, g.user["uid"])

        if operator is None:
            return make_response("Operator not found", 404)

        try:
            session.delete(operator)
            session.commit()
            return make_response("Operator deleted successfully", 200)
        except IntegrityError:
            session.rollback()
            return make_response("Operator has tickets refrencing it, cannot be deleted", 400)

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
            session, operator_id, g.user["uid"])

        # Return early if invalid operator id provided
        if operator is None:
            return make_response("Operator not found", 404)

        operator_email = session.query(Operator).filter(
            and_(
                Operator.operator_email == email,
                Operator.company_id == operator.company_id,
                Operator.operator_id != operator.operator_id
            )).first()

        if operator_email is not None:
            return make_response('Operator email already used', 400)

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
            return make_response('Token required.', 404)
        try:
            # Change max_age as per your requirements
            op = s.loads(token, salt=SALT, max_age=3600)
        except:
            return make_response('The confirmation link is invalid or has expired.', 400)

        operator = session.query(Operator).filter_by(
            operator_id=op["operator_id"]).first()

        if operator is None:
            return make_response('Operator not found.', 404)

        if operator.confirmed:
            return make_response('Account already confirmed.', 200)

        operator.confirmed = True
        session.commit()

        return make_response('You have confirmed your account. Thanks!', 200)

    def generate_operator_auth_token(session, request_token):
        '''
        Generates an auth token and sends it via email to an operator.

        Parameters:
            Session (session): SQLAlchemy db session
            operator_id (int): Operator's id

        Returns:
            Responses: 200 OK if successful, 404 if operator not found
        '''

        s = URLSafeTimedSerializer(SEND_OPERATOR_RFO_TOKEN_SECRET)

        print(
            f"TOKEN {request_token} \nSEND OPERATOR RFO TOKEN SECRET: {SEND_OPERATOR_RFO_TOKEN_SECRET}")
        try:
            data = s.loads(
                request_token, max_age=86400)  # Token valid for 24 hours
        except SignatureExpired as e:
            print(e)
            return make_response('Token expired.', 400)
        except BadTimeSignature as e:
            print(e)
            return make_response('Invalid token.', 400)

        operator = session.query(Operator).filter_by(
            operator_id=data["operator_id"], confirmed=True).first()

        rfo = session.query(RFO).filter_by(rfo_id=data["rfo_id"]).first()

        if operator is None:
            return make_response('Operator not found.', 404)

        if rfo is None:
            return make_response('RFO not found.', 404)

        # Generate a unique alphanumeric token for the operator
        s = URLSafeTimedSerializer(OPERATOR_AUTH_TOKEN_SECRET)
        token = s.dumps(
            {'operator_id': data["operator_id"], 'rfo_id': data["rfo_id"]})

        # Send the token to the operator's email
        send_operator_auth_token(
            Mail(app), operator.operator_email, token, operator.operator_name)

        return make_response('Token sent to operator email.', 200)

    def validate_operator_auth_token(session, token):
        '''
        Validates an operator's token. Returns a access token. Token will last 24 hours

        Parameters:
            Session (session): SQLAlchemy db session
            token (str): Token string

        Returns:
            Responses: 200 OK if successful, 404 if operator not found, 400 if token is expired or invalid
        '''
        authS = URLSafeTimedSerializer(OPERATOR_AUTH_TOKEN_SECRET)

        try:
            # Token valid for 24 hours
            data = authS.loads(token, max_age=86400)
        except SignatureExpired:
            return make_response('Token expired.', 400)
        except BadTimeSignature:
            return make_response('Invalid token.', 400)

        operator = session.query(Operator).filter_by(
            operator_id=data['operator_id']).first()

        if operator is None:
            return make_response('Operator not found.', 404)

        if operator.confirmed is False:
            return make_response('Operator email not verified.', 401)

        rfo = session.query(RFO).filter_by(rfo_id=data['rfo_id']).first()

        if rfo is None:
            return make_response('RFO not found.', 404)

        accessS = URLSafeTimedSerializer(OPERATOR_ACCESS_TOKEN_SECRET)

        # Once the token is validated, you may issue a new token (access token)
        access_token = accessS.dumps(data)

        return make_response({'access_token': access_token}, 200)
