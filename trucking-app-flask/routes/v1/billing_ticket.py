from flask import Blueprint
from controllers.billing_ticket_controller import BillingTicketController

billing_ticket = Blueprint("billing_ticket", __name__)


@billing_ticket.route("/", methods=["GET"])
def GET():
    return BillingTicketController.GET()


@billing_ticket.route("/", methods=["POST"])
def POST():
    return BillingTicketController.POST()


@billing_ticket.route("/", methods=["PUT"])
def PUT():
    return BillingTicketController.PUT()


@billing_ticket.route("/", methods=["DELETE"])
def DELETE():
    return BillingTicketController.DELETE()
