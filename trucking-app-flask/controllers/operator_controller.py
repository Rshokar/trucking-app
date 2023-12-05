from itsdangerous import URLSafeTimedSerializer
from models import Operator, Company, RFO, BillingTickets, Dispatch, ContactMethods
from sqlalchemy.exc import IntegrityError
from utils import send_verification_email, send_operator_auth_token
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
import random
from sqlalchemy import and_
from flask import current_app as app, g, make_response
from datetime import datetime, timedelta
from flask_mail import Mail
import os
from services.notification_service import NotificationServiceFactory

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
            .order_by(Operator.operator_name.asc())\
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
        req = request.get_json()
        company_id = req.get('company_id')
        name = req.get('operator_name')
        email = req.get('operator_email').lower() if req.get('operator_email') else None
        contact_method = req.get('contact_method')
        operator_phone = req.get("operator_phone")
        operator_phone_country_code = req.get("operator_phone_country_code")
        
        # Validate Contact method exist
        if contact_method == ContactMethods.email.value and (email is None or email == ''):
            return make_response("If contact method is email, email must exist", 400)
        
        # Validate Contact method exist
        if contact_method == ContactMethods.sms.value and ((operator_phone is None or operator_phone == '') or (operator_phone_country_code is None or operator_phone_country_code == '')): 
            return make_response("If contact method is sms, phone and country code must exist", 400)

        company = session.query(Company).filter_by(
            company_id=company_id, owner_id=g.user["uid"]).first()

        if company is None:
            return make_response(f"Company with ID {company_id} not found", 404)
        
        if contact_method == ContactMethods.sms.value: 
            operator_email = session.query(Operator).filter_by(
                operator_phone=operator_phone, company_id=company_id).first()

            if operator_email is not None:
                return make_response('Operator phone number already used', 400)

            
        if contact_method == ContactMethods.email.value: 
            operator_email = session.query(Operator).filter_by(
                operator_email=email, company_id=company_id).first()

            if operator_email is not None:
                return make_response('Operator email already used', 400)

        # Create operator
        new_operator = Operator(company_id, name, contact_method, email, operator_phone, operator_phone_country_code)

        session.add(new_operator)
        session.commit()

        # Generate unique token for the operator
        token = s.dumps({"operator_id": new_operator.operator_id}, salt=SALT)
        service_factory = NotificationServiceFactory()
        notifcation_service = service_factory.get_notification_service(contact_method) 
        try:
            notifcation_service.send_operator_verification(new_operator, token, company.company_name)
        except Exception as e:
            print(e)

        return make_response(new_operator.to_dict(), 201)

    def send_validation_email(session, operator_id):
        """_summary_
            Sends a validation email to the operator
        Args:
            session (_type_): _description_
            operator_id (_type_): _description_

        Returns:
            _type_: _description_
        """
        mail = Mail(app)
        print(g.user["uid"], operator_id)
        operator = Operator.get_operator_by_id_and_owner(
            session, operator_id, g.user["uid"])

        if operator is None:
            return make_response('Operator does not exist', 404)

        if operator.confirmed is True:
            return make_response('Operator has already been validated', 400)

            # Generate unique token for the operator
        token = s.dumps({"operator_id": operator.operator_id}, salt=SALT)

        try:
            # Send verification email to the new operator
            send_verification_email(
                mail, operator.operator_email, token, operator.operator_name, operator.company.company_name)
        except Exception as e:
            return make_response("Error sending email", 500)

        return make_response("Email sent", 200)

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

    def update_operator(session, request, op_id):
        """
        Update an already existing operator in db (if found)

        Parameters:
            Session (session): SQLAlchemy database session
            Request (request): API Request
            op_id (int): ID that uniquely identifies operator in database

        Return:
            Responses: 200 OK if successful, 404 if operator not found
        """
        req = request.get_json()
        company_id = req.get('company_id')
        name = req.get('operator_name')
        email = req.get('operator_email').lower() if req.get('operator_email') else None
        contact_method = req.get('contact_method')
        operator_phone = req.get("operator_phone")
        country_code = req.get("operator_phone_country_code")
        
        # Validate Contact method exist
        if contact_method == ContactMethods.email.value and (email is None or email == ''):
            return make_response("If contact method is email, email must exist", 400)
        
        # Validate Contact method exist
        if contact_method == ContactMethods.sms.value and ((operator_phone is None or operator_phone == '') or (country_code is None or country_code == '')): 
            return make_response("If contact method is sms, phone and country code must exist", 400)

        operator = Operator.get_operator_by_id_and_owner(
            session, op_id, g.user["uid"])

        # Return early if invalid operator id provided
        if operator is None:
            return make_response("Operator not found", 404)
        
        if contact_method == ContactMethods.sms.value: 
            operator_email = session.query(Operator).filter(and_(
                Operator.operator_phone == operator_phone,
                Operator.operator_phone_country_code == country_code,
                Operator.company_id == operator.company_id,
                Operator.operator_id != operator.operator_id
            )).first()

            if operator_email is not None:
                return make_response('Operator phone number already used', 400)

            
        if contact_method == ContactMethods.email.value: 
            operator_email = session.query(Operator).filter(and_(
                Operator.operator_email == email,
                Operator.company_id == operator.company_id,
                Operator.operator_id != operator.operator_id
            )).first()

            if operator_email is not None:
                return make_response('Operator email already used', 400)

        # If email, phone or phone country code is changed a notification to verify contact method is done
        if (contact_method == ContactMethods.email.value and operator.operator_email != email) or (contact_method == ContactMethods.sms.value and (operator.operator_phone != operator_phone) or (operator.operator_phone_country_code != country_code)):
            print("RE VERFIY")
            operator.operator_email = email
            operator.operator_name = name
            operator.contact_method = contact_method
            operator.operator_phone = operator_phone
            operator.operator_phone_country_code = country_code
            operator.confirmed = False
            # Generate unique token for the operator
            token = s.dumps({"operator_id": operator.operator_id}, salt=SALT)
            service_factory = NotificationServiceFactory()
            notifcation_service = service_factory.get_notification_service(contact_method) 
            try:
                notifcation_service.send_operator_verification(operator, token, operator.company.company_name)
            except Exception as e:
                print(e)

        operator.operator_email = email
        operator.operator_name = name
        operator.contact_method = contact_method
        operator.operator_phone = operator_phone
        operator.operator_phone_country_code = country_code

        
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
            op = s.loads(token, salt=SALT, max_age=172800)  # Two days
        except:
            return make_response('The confirmation link is invalid or has expired.', 403)

        operator = session.query(Operator).filter_by(
            operator_id=op["operator_id"]).first()

        if operator is None:
            return make_response('Operator not found.', 404)

        if operator.confirmed is True:
            return make_response('Account already confirmed.', 200)

        operator.confirmed = True
        session.commit()

        return make_response('You have confirmed your account. Thanks!', 200)

    def send_code_to_operator(session, request_token):
        '''
        Generates an auth token and sends it via email to an operator.

        Parameters:
            Session (session): SQLAlchemy db session
            operator_id (int): Operator's id

        Returns:
            Responses: 200 OK if successful, 404 if operator not found
        '''

        s = URLSafeTimedSerializer(SEND_OPERATOR_RFO_TOKEN_SECRET)

        try:
            data = s.loads(
                request_token)
        except SignatureExpired as e:
            print(e)
            return make_response('Token expired.', 400)
        except BadTimeSignature as e:
            print(e)
            return make_response('Invalid token.', 400)

        operator = session.query(Operator).filter_by(
            operator_id=data["operator_id"], confirmed=True).first()

        if operator is None:
            return make_response('Operator not found.', 404)

        rfo = session.query(RFO).filter_by(rfo_id=data["rfo_id"], ).first()

        if rfo is None:
            return make_response('RFO not found.', 404)

        dispatch = session.query(Dispatch).filter_by(
            dispatch_id=rfo.dispatch_id).first()

        # If dispatch is expired return a 401
        if dispatch.expired():
            return make_response("Dispatch is expired", 401)

        # Generate a unique alphanumeric token for the operator
        six_digit_number = random.randint(100000, 999999)

        print(six_digit_number)

        rfo.token = six_digit_number
        rfo.token_date = datetime.now()
        rfo.token_consumed = False

        session.commit()

        # Send the token to the operator's email
        send_operator_auth_token(
            Mail(app), operator.operator_email, six_digit_number, operator.operator_name)

        return make_response('Token sent to operator email.', 200)

    def validate_operator_auth_token(session, token, code):
        '''
        Validates an operator's authentication token and corresponding code. If successful,
        flips the consumed field in RFO (Request For Order) and returns an access token.

        Parameters:
            session (Session): SQLAlchemy db session.
            token (str): The token string to be validated.
            code (str): The code associated with the token.

        Returns:
            Response: HTTP response with status code and message.
                - 200 OK if successful, along with the access token in the response body.
                - 400 Bad Request if the token is expired or invalid.
                - 401 Unauthorized if the operator email is not verified, or the code is already used or expired.
                - 404 Not Found if the operator is not found.

        Exceptions:
            SignatureExpired: Raised when the token is expired.
            BadTimeSignature: Raised when the token is invalid.
        '''

        authS = URLSafeTimedSerializer(SEND_OPERATOR_RFO_TOKEN_SECRET)

        try:
            data = authS.loads(token)
        except SignatureExpired:
            return make_response('Token expired.', 400)
        except BadTimeSignature:
            return make_response('Invalid token.', 400)

        # Combined query to fetch operator and rfo
        result = session.query(Operator, RFO).join(RFO, Operator.operator_id == RFO.operator_id).filter(
            Operator.operator_id == data['operator_id'],
            RFO.rfo_id == data['rfo_id'],
            RFO.token == code
        ).first()

        if result is None:
            return make_response('Operator or RFO not found.', 404)

        operator, rfo = result

        if operator.confirmed is False:
            return make_response('Operator email not verified.', 401)

        if rfo.token_consumed is True:
            return make_response("Code has already been used!", 401)

        dispatch = session.query(Dispatch).filter_by(
            dispatch_id=rfo.dispatch_id).first()

        if dispatch.expired():
            return make_response("Dispatch is expired", 401)

        # Check if the token was created more than 5 minutes before the request was made.
        if rfo.token_date < datetime.now() - timedelta(minutes=5):
            return make_response("The code provided is expired", 401)

        accessS = URLSafeTimedSerializer(OPERATOR_ACCESS_TOKEN_SECRET)

        # Once the token is validated, you may issue a new token (access token)
        access_token = accessS.dumps(data)

        # Directly update the token_consumed field without fetching the record first
        session.query(RFO).filter_by(
            rfo_id=data['rfo_id']).update({'token_consumed': True})

        session.commit()
        return make_response({'access_token': access_token}, 200)

    def get_rfo(session, data):
        """
            Gets the neccessary data for an operator to view there rfo
        """
        # Get RFO, Disaptch, Customer, Bills, and operator
        rfo = session.query(RFO).filter_by(rfo_id=data['rfo_id']).first()

        if rfo is None:
            return make_response("RFO not found", 404)

        oper = session.query(Operator).filter_by(
            operator_id=data['operator_id']).first()

        if oper is None:
            return make_response("Operator not found", 404)

        bills = session.query(BillingTickets).filter_by(
            rfo_id=data['rfo_id']).all()
        disp = rfo.dispatch
        res = {
            "rfo": rfo.to_dict(),
            "dispatch": disp.to_dict(),
            "customer": disp.customer.to_dict(),
            "operator": oper.operator_name,
            "company": disp.company.to_dict(),
            "bills": [bill.to_dict() for bill in bills]
        }

        return make_response(res, 200)
