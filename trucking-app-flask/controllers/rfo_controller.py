from flask import Response
from models import RFO, Dispatch, Operator
from utils import make_response
import json


class RfoController:

    def GET():
        return Response(
            response=json.dumps({"data": "RFO_GET"}),
            status=200,
            mimetype='application/json'
        )

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
            start_time=data['start_time'],
            dump_location=data['dump_location'],
            load_location=data['load_location']
        )
        session.add(rfo)
        session.commit()
        return make_response({'message': 'RFO created successfully'}), 201

    def PUT():
        return Response(
            response=json.dumps({"data": "RFO_PUT"}),
            status=200,
            mimetype='application/json'
        )

    def DELETE():
        return Response(status=204)
