from flask import Response
from models import RFO, Dispatch, Operator
from utils import make_response
from datetime import datetime
import json


class RfoController:

    def get_rfo(session, rfo_id):
        try:
            rfo = session.query(RFO).filter_by(rfo_id=rfo_id).first()
            if rfo is None:
                return make_response({'error': 'RFO not found'}, 404)
            return make_response(rfo.to_dict(), 200)
        except Exception as e:
            print(e)

    # def get_all_rfo(request, disaptch_id=None, operator_id=None, ):

    def create_rfo(request, session):
        data = request.json

        disp_id = data['dispatch_id']
        # Check if dispatch exist
        disp = session.query(Dispatch).filter_by(dispatch_id=disp_id).first()
        if disp is None:
            return make_response({'error': 'Dispatch not found'}), 404

        oper_id = data['operator_id']
        # Check if operator exist
        oper = session.query(Operator).filter_by(
            operator_id=oper_id, company_id=disp.company_id).first()
        if oper is None:
            return make_response({'error': 'Operator not found'}), 404

        rfo = RFO(
            dispatch_id=disp_id,
            operator_id=oper_id,
            trailer=data['trailer'],
            truck=data['truck'],
            start_location=data['start_location'],
            start_time=datetime.strptime(
                data['start_time'], "%Y-%m-%d %H:%M:%S"),
            dump_location=data['dump_location'],
            load_location=data['load_location']
        )
        session.add(rfo)
        session.commit()
        return make_response(rfo.to_dict(), 201)

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

        oper = session.query(Operator).filter_by(
            operator_id=operator_id).first()
        if oper is None:
            return make_response({"error": "Operator not found"}, 404)

        disp = session.query(Dispatch).filter_by(
            dispatch_id=rfo.dispatch_id).first()

        if disp.company_id != oper.company_id:
            return make_response({"error": "Dispatch and Operator are not from the same company"}, 400)

        rfo.operator_id = operator_id
        rfo.load_location = load_location
        rfo.dump_location = dump_location
        rfo.start_location = start_location
        rfo.start_time = datetime.strptime(strart_time, "%Y-%m-%d %H:%M:%S")
        rfo.trailer = trailer
        rfo.truck = truck

        session.commit()

        return make_response(rfo.to_dict(), 200)

    def delete_rfo(session, rfo_id):
        # Check if rfo exist
        rfo = session.query(RFO).filter_by(rfo_id=rfo_id).first()
        if rfo is None:
            return make_response({'error': 'RFO not found'}, 404)
        session.delete(rfo)
        session.commit()
        return make_response({'message': 'RFO deleted'}, 200)
