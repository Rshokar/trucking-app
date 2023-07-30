from flask import Blueprint, g, request
from controllers.billing_ticket_controller import BillingTicketController
import jsonschema
from utils import make_response
from validations import billing_ticket_validation, billing_ticket_upate
from flask_login import login_required

billing_ticket = Blueprint("billing_ticket", __name__)


@billing_ticket.route("/", methods=["GET"])
@login_required
def get_all_bills():
    # Get params and set deafults
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 0))
    rfo_id = int(request.args.get('rfo_id', 0))

    return BillingTicketController.get_all_bills(g.session, page, limit, rfo_id)


@billing_ticket.route("/<int:bill_id>", methods=["GET"])
@login_required
def get_bill(bill_id):
    return BillingTicketController.get_bill(session=g.session, bill_id=bill_id)


@billing_ticket.route("/", methods=["POST"])
@login_required
def create_bill():
    try:
        jsonschema.validate(request.json, billing_ticket_validation)
        return BillingTicketController.create_bill(g.session, request)
    except jsonschema.ValidationError as e:
        return make_response({"error": e.message}, 400)


@billing_ticket.route("/<int:bill_id>", methods=["PUT"])
@login_required
def update_bill(bill_id):
    try:
        jsonschema.validate(request.json, billing_ticket_upate)
        return BillingTicketController.update_bill(g.session, request, bill_id)
    except jsonschema.ValidationError as e:
        return make_response({"error": e.message}, 400)


@billing_ticket.route("/<int:bill_id>", methods=["DELETE"])
@login_required
def delete_bill(bill_id):
    return BillingTicketController.delete_bill(g.session, bill_id)
