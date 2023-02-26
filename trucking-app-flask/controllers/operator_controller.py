from flask import Response, jsonify
from models import Operator, Company
from utils import make_response

# Limited validation done in controllers. Only validation is making sure operator exists.
# Full validation is done on the database side.

#Operator always accessed through company

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

        request_data = request.get_json()
        operator_id = request.get('operator_id')
        company_id = request_data.get('company_id')
        operator_name = request.get('operator_type')
        operator_email = request.get('operator_type')




    #@app.route('/', methods=["GET"])
    # def GET():
    #     return Response(
    #         response=json.dumps({"data": "OPERATOR_GET"}),
    #         status=200,
    #         mimetype='application/json'
    #     )
    #     #alternatively can return an HTML template via a templating engine - maybe Jinja?
    

    # #@app.route('/', methods=["POST"])
    # def POST():
    #     return Response(
    #         response=json.dumps({"data": "OPERATOR_POST"}),
    #         status=200,
    #         mimetype='application/json'
    #     )

    # #@app.route('/', methods=["PUT"])
    # def PUT():
    #     return Response(
    #         response=json.dumps({"data": "OPERATOR_PUT"}),
    #         status=200,
    #         mimetype='application/json'
    #     )

    # #@app.route('/', methods=["DELETE"])
    # def DELETE():
    #     return Response(status=204) #204 - No Content