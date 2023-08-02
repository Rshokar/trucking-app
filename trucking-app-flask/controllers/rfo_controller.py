from flask import Response
from models import RFO, Dispatch, Operator, Company
from sqlalchemy import and_
from utils import make_response
from datetime import datetime
from flask_login import current_user
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

    def get_all_rfo(session, limit: int, page: int, dispatch_id: int):

        print(dispatch_id)

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
            .limit(limit).offset(page * limit).all()

        print(rfos)
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

        return make_response(rfo.to_dict(), 200)

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
