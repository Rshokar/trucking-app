from flask import Response
from models.billing_tickets import BillingTickets
import json


class BillingTicketController:

    def GET():
        return Response(
            response=json.dumps({"data": "BILLING_TICKET_GET"}),
            status=200,
            mimetype='application/json'
        )

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
