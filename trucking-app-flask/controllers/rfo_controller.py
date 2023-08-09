from flask import Response, current_app as app
from models import RFO, Dispatch, Operator, Company, Customer
from sqlalchemy import and_
from utils import make_response, send_operator_rfo
from datetime import datetime
from flask_login import current_user
from itsdangerous import BadTimeSignature, SignatureExpired, URLSafeTimedSerializer
from flask_mail import Mail
import json
import os

SEND_OPERATOR_RFO_TOKEN_SECRET = os.environ.get(
    "SEND_OPERATOR_RFO_TOKEN_SECRET")

OPERATOR_ACCESS_TOKEN_SECRET = os.environ.get(
    "OPERATOR_ACCESS_TOKEN_SECRET"
)


class RfoController:

    def get_rfo(session, rfo_id):
        try:
            rfo = session.query(RFO).filter_by(rfo_id=rfo_id).first()
            if rfo is None:
                return make_response({'error': 'RFO not found'}, 404)
            return make_response(rfo.to_dict(), 200)
        except Exception as e:
            print(e)

    def get_all_rfo(session, limit: int, page: int, dispatch_id: int, operator_id: int):
        # First we need to check id the dispatch
        # belongs to the current user
        if (dispatch_id is not None):
            disp = session.query(Dispatch)\
                .join(Company, Dispatch.company_id == Company.company_id)\
                .where(Company.owner_id == current_user.id)\
                .first()
            # if it does not, return a 404
            if (disp is None):
                return make_response({"error": "Dispatch not found"}, 404)

        rfos = session.query(RFO, Operator)\
            .join(Operator, Operator.operator_id == RFO.operator_id)\
            .where(RFO.dispatch_id == dispatch_id if dispatch_id is not None else True)\
            .where(RFO.operator_id == operator_id if operator_id is not None else True)\
            .limit(limit).offset(page * limit).all()

        result = []

        for rfo, op in rfos:
            result.append({
                "rfo_id": rfo.rfo_id,
                "dispatch_id": rfo.dispatch_id,
                "operator_id": rfo.operator_id,
                "trailer": rfo.trailer,
                "truck": rfo.truck,
                "start_location": rfo.start_location,
                "dump_location": rfo.dump_location,
                "load_location": rfo.load_location,
                "start_time": rfo.start_time.isoformat(),
                "operator": {"operator_name": op.operator_name}
            })

        return make_response(result, 200)

    def create_rfo(request, session):
        data = request.json

        disp_id = data['dispatch_id']
        # Check if dispatch exist
        disp = session.query(Dispatch).filter_by(dispatch_id=disp_id).first()
        if disp is None:
            return make_response({'error': 'Dispatch not found'}, 404)

        comp = session.query(Company).filter_by(
            owner_id=current_user.id).first()

        if comp is None:
            return make_response({'error': 'Company not found'}, 404)

        if comp.company_id != disp.company_id:
            return make_response({"error": "Dispatch not found"}, 404)

        oper_id = data['operator_id']
        # Check if operator exist
        oper = session.query(Operator).filter_by(
            operator_id=oper_id, company_id=comp.company_id).first()
        if oper is None:
            return make_response({'error': 'Operator not found'}, 404)

        rfo = RFO(
            dispatch_id=disp_id,
            operator_id=oper_id,
            trailer=data['trailer'],
            truck=data['truck'],
            start_location=data['start_location'],
            start_time=datetime.strptime(
                data['start_time'], "%Y-%m-%d %H:%M:%S"),
            dump_location=data['dump_location'],
            load_location=data['load_location'],
        )
        session.add(rfo)
        session.commit()

        # to_dict should not change rfo.start_time to string.
        res = rfo.to_dict()
        res["operator"] = oper.to_dict()
        # Conversion is done here instead.
        res["start_time"] = rfo.start_time.isoformat()

        return make_response(res, 201)

    def update_rfo(session, request, rfo_id):
        request_json = request.json

        operator_id = request_json['operator_id']
        load_location = request_json['load_location']
        dump_location = request_json['dump_location']
        start_location = request_json['start_location']
        strart_time = request_json['start_time']
        truck = request_json['truck']
        trailer = request_json['trailer']

        rfo = session.query(RFO).filter_by(rfo_id=rfo_id).first()
        if rfo is None:
            return make_response({'error': 'RFO not found'}, 404)

        # Get Company
        comp = session.query(Company).filter_by(
            owner_id=current_user.id).first()
        if comp is None:
            return make_response({'error': 'Company not found'}, 404)

        if operator_id != rfo.operator_id:
            oper = session.query(Operator).filter_by(
                operator_id=operator_id, company_id=comp.company_id).first()
            if oper is None:
                return make_response({'error': 'Operator not found'}, 404)

        disp = session.query(Dispatch).filter_by(
            dispatch_id=rfo.dispatch_id, company_id=comp.company_id).first()

        if disp is None:
            return make_response({'error': 'Dispatch not found'}, 404)

        rfo.operator_id = operator_id
        rfo.load_location = load_location
        rfo.dump_location = dump_location
        rfo.start_location = start_location
        rfo.start_time = datetime.strptime(strart_time, "%Y-%m-%d %H:%M:%S")
        rfo.trailer = trailer
        rfo.truck = truck

        session.commit()

        res = rfo.to_dict()
        # Conversion is done here instead.
        res["start_time"] = rfo.start_time.isoformat()

        return make_response(res, 200)

    def delete_rfo(session, rfo_id):
        # Check if rfo exist
        rfo = session.query(RFO)\
            .join(Dispatch, RFO.dispatch_id == Dispatch.dispatch_id)\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .filter(and_(RFO.rfo_id == rfo_id, Company.owner_id == current_user.id))\
            .first()

        if rfo is None:
            return make_response({'error': 'RFO not found'}, 404)

        session.delete(rfo)
        session.commit()
        return make_response({'message': 'RFO deleted'}, 200)

    def operator_get_rfo(session, token):
        '''
        Fetch RFO, Dispatch, Company, and Customer details for an operator with valid token

        Parameters:
            Session (session): SQLAlchemy db session
            token (str): Token string

        Returns:
            Responses: 200 OK if successful, 404 if RFO not found, 400 if token is expired or invalid
        '''
        s = URLSafeTimedSerializer(OPERATOR_ACCESS_TOKEN_SECRET)

        try:
            data = s.loads(token, max_age=86400)  # Token valid for 24 hours
        except SignatureExpired:
            return make_response({'error': 'Token expired.'}, 400)
        except BadTimeSignature:
            return make_response({'error': 'Invalid token.'}, 400)

        result = session.query(RFO, Dispatch, Company, Customer)\
            .join(Dispatch, RFO.dispatch_id == Dispatch.dispatch_id)\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .join(Customer, Dispatch.customer_id == Customer.customer_id)\
            .filter(RFO.rfo_id == data['rfo_id']).first()

        if result is None:
            return make_response({'error': 'RFO not found.'}, 404)

        rfo, dispatch, company, customer = result

        response = {
            'rfo': rfo.to_dict(),
            'dispatch': dispatch.to_dict(),
            'company': company.to_dict(False, False),
            'customer': customer.to_dict()
        }

        return make_response(response, 200)

    def send_operator_rfo_email(session, rfo_id):
        '''
        Fetches RFO, related Operator, Company, Customer, and Dispatch details from database 
        and then sends email to operator with a link to RFO

        Parameters:
            session (session): SQLAlchemy db session
            rfo_id (int): RFO's id

        Returns:
            Responses: 200 OK if successful, 404 if RFO not found or email sending failed
        '''
        rfo = session.query(RFO).filter_by(rfo_id=rfo_id).first()

        if rfo is None:
            return make_response({'error': 'RFO not found'}, 404)

        operator = session.query(Operator).filter_by(
            operator_id=rfo.operator_id).first()
        if operator is None:
            return make_response({'error': 'Operator not found'}, 404)

        company = session.query(Company).filter_by(
            company_id=operator.company_id, owner_id=current_user.id).first()
        if company is None:
            return make_response({'error': 'Company not found'}, 404)

        dispatch = session.query(Dispatch).filter_by(
            dispatch_id=rfo.dispatch_id).first()
        if dispatch is None:
            return make_response({'error': 'Dispatch not found'}, 404)

        customer = session.query(Customer).filter_by(
            customer_id=dispatch.customer_id).first()
        if customer is None:
            return make_response({'error': 'Customer not found'}, 404)
        s = URLSafeTimedSerializer(SEND_OPERATOR_RFO_TOKEN_SECRET)
        token_data = {"operator_id": operator.operator_id,
                      "rfo_id": rfo.rfo_id}
        # This will give you a secure token with the operator_id and rfo_id

        token = s.dumps(token_data)

        try:
            send_operator_rfo(Mail(app), operator.operator_email,
                              rfo, operator, company, customer, dispatch, token)
        except Exception as e:
            return make_response({'error': 'Failed to send email. ' + str(e)}, 500)

        return make_response({'message': 'Email sent to operator.'}, 200)
