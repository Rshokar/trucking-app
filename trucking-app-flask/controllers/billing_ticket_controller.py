
from flask import Response
from models.billing_tickets import BillingTickets, RFO
from utils import make_response
import json


class BillingTicketController:

    def get_billing_ticket(session, bill_id):
        """_summary_
            Gets a single billing ticket from the database
        Args:
            session (_type_): _description_
            bill_id (int): billing ticket id
        Returns:
            Response: 200, 404
        """
        bill = session.query(BillingTickets).filter_by(bill_id=bill_id).first()
        if bill is None:
            return make_response({"error": "Billing ticket not found"}, 404)
        return make_response(bill.to_dict(), 200)

    def create_bill(session, request):
        """_summary_
            Creates a billing ticket in the database
        Args:
            request (_type_): _description_
        Returns:
            Response: 201, 400
        """
        rfo_id = request.json["rfo_id"]
        ticket_number = request.json["ticket_number"]
        image_id = request.json["image_id"]

        rfo = session.query(RFO).filter_by(rfo_id=rfo_id).first()
        if rfo is None:
            return make_response({"error": "RFO not found"}, 404)

        bill = BillingTickets(
            request.json["rfo_id"],
            request.json["ticket_number"],
            request.json["image_id"]
        )
        session.add(bill)
        session.commit()
        return make_response(bill.to_dict(), 201)

    def PUT():
        return Response(
            response=json.dumps({"data": "BILLING_TICKET_PUT"}),
            status=200,
            mimetype='application/json'
        )

    def DELETE():
        return Response(status=204)
