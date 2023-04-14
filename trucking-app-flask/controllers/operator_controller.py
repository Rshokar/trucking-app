from models import Operator, Company
from sqlalchemy.exc import IntegrityError
from utils import make_response
from flask_login import current_user
from sqlalchemy import and_
# Operator always accessed through company


class OperatorController:

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

        new_operator = Operator(company_id=company_id,
                                operator_name=name, operator_email=email)
        session.add(new_operator)
        session.commit()

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
