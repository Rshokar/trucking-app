from models import Operator, Company
from utils import make_response

# Limited validation done in controllers. Only validation is making sure operator exists.
# Full validation is done on the database side.

#Operator always accessed through company

class OperatorController:

    def get_operator(session, operator_id, ):
        '''
        Search for an Operator using their uniquely identifying ID

        Parameters: 
            Session (session): SQLAlchemy db session
            operator_id (int): Integer that uniquely identifies an individual operator

        Returns:
            Responses: 200 OK if successful, 404 if not successful
        '''
        operator = session.query(Operator).filter_by(operator_id=operator_id).first()
        print(f"The operator is: {operator}")
        if operator is None:
            print(f"Operator: {operator}")
            return make_response({'error': 'Operator not found.'}, 404) # HTTP code 404 Not Found
        return make_response(operator.to_dict(), 200) # 200 OK
    

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
        company = session.query(Company).filter_by(company_id=company_id).first()
        if not company:
            make_response({"error": "Company with ID {company_id} not found"}, 400)

        operator_name = req.get('operator_name')
        operator_email = req.get('operator_email')

        new_operator = Operator(company_id=company_id, operator_name=operator_name, operator_email=operator_email)
        session.add(new_operator)
        session.commit()

        return make_response(new_operator.to_dict(), 201)
        
    # Delete an operator
    def delete_operator(session, operator_id, company_id):
        '''
        Delete an operator (if successful)

        Parameters:
            Session (session): SQLAlchemy db session
            operator_id (int) : operator_id
            company_id (int): company_id

        Returns:
            Responses: 201 Created
        '''
        operator = Operator.query.get(operator_id)
        if not operator:
            make_response(404, f"Operator not found")
        if operator.company_id != company_id:
            make_response({"error" : "Company not found"}, 400)

        session.delete(operator)
        session.commit()

        return make_response({"message": "Operator deleted successfully"}, 200)

    # Make changes to an existing operator
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

            operator = session.query(Operator).get(operator_id)

            # Return early if invalid operator id provided
            if operator is None:
                return make_response({'error': "Operator not found"}, 404)
            
            # Otherwise, continue
            request_data = request.get_json()
            company_id = request_data['company_id']
            company = session.query(Company).filter_by(company_id=company_id).first()
            if company is None:
                return make_response({'error': 'Company not found'}, 404)
            print(company)
            operator.company_id = company
            
            operator_email = request_data['operator_email']
            email = session.query(Operator).filter_by(operator_email=operator_email).first()
            if operator_email:
                return make_response({'error': 'Operator email already used'}, 400)
            operator.operator_email = email

            session.commit()





    