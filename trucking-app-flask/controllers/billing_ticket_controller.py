
from flask import Response
from models.billing_tickets import BillingTickets
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

    def POST():
        return Response(
            response=json.dumps({"data": "BILLING_TICKET_POST"}),
            status=200,
            mimetype='application/json'
        )

    def PUT():
        return Response(
            response=json.dumps({"data": "BILLING_TICKET_PUT"}),
            status=200,
            mimetype='application/json'
        )

    def DELETE():
        return Response(status=204)
