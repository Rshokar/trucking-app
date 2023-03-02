from flask import Blueprint, g
from controllers.billing_ticket_controller import BillingTicketController

billing_ticket = Blueprint("billing_ticket", __name__)


@billing_ticket.route("/<int:bill_id>", methods=["GET"])
def get_billing_ticket(bill_id):
    return BillingTicketController.get_billing_ticket(session=g.session, bill_id=bill_id)


@billing_ticket.route("/", methods=["POST"])
def POST():
    return BillingTicketController.POST()


@billing_ticket.route("/", methods=["PUT"])
def PUT():
    return BillingTicketController.PUT()


@billing_ticket.route("/", methods=["DELETE"])
def DELETE():
    return BillingTicketController.DELETE()
