from models import Dispatch, Company, Customer
from flask import jsonify
from datetime import datetime
from utils import make_response



class DispatchController:
    
    def get_dispatch(session, dispatch_id):
        dispatch = session.query(Dispatch).filter_by(dispatch_id=dispatch_id).first()
        print(f"DISPATCH: {dispatch}")
        if dispatch is None:
            print(f"DISPATCH: {dispatch}")
            return make_response({'error': 'Dispatch not found'}, 404)
        return make_response(dispatch.to_dict())


    def create_dispatch(self, session, request):
        request_data = request.get_json()
        company_id = request_data.get('company_id')
        customer_id = request_data.get('customer_id')
        notes = request_data.get('notes')
        date = request_data.get('date')

        company = session.query(Company).filter_by(company_id=company_id)
        if company is None:
            return jsonify({'error': 'Company not found'}), 404
        customer = session.query(Customer).filter_by(
            customer_id=customer_id).first()
        if customer is None:
            return jsonify({'error': 'Customer not found'}), 404
        dispatch = Dispatch(company_id, customer_id, notes,
                            datetime.strptime(date, '%Y-%m-%d %H:%M:%S'))
        session.add(dispatch)
        session.commit()
        return jsonify({'message': 'Dispatch created successfully', 'dispatch': dispatch.to_dict()}), 201
