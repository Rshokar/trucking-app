from flask import Blueprint, g, request
from controllers.billing_ticket_controller import BillingTicketController
import jsonschema
from utils import make_response
from validations import billing_ticket_validation

billing_ticket = Blueprint("billing_ticket", __name__)


@billing_ticket.route("/<int:bill_id>", methods=["GET"])
def get_bill(bill_id):
    return BillingTicketController.get_bill(session=g.session, bill_id=bill_id)


@billing_ticket.route("/", methods=["POST"])
def create_bill():
    try:
        jsonschema.validate(request.json, billing_ticket_validation)
        return BillingTicketController.create_bill(g.session, request)
    except jsonschema.ValidationError as e:
        return make_response({"error": e.message}, 400)


@billing_ticket.route("/", methods=["PUT"])
def PUT():
    return BillingTicketController.PUT()


@billing_ticket.route("/<int:bill_id>", methods=["DELETE"])
def delete_bill(bill_id):
    return BillingTicketController.delete_bill(g.session, bill_id)
