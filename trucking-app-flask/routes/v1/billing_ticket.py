from flask import Blueprint, g, request
from controllers.billing_ticket_controller import BillingTicketController
import jsonschema
from utils import make_response
from validations import billing_ticket_validation, billing_ticket_upate
from flask_login import login_required
from config import is_image

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
    if request.mimetype != 'multipart/form-data':
        return make_response({"error": "Content type must be multipart/form-data"}, 400)

    if 'file' not in request.files:
        return make_response({"error": "No file part in the request."}, 400)

    file = request.files['file']
    if not file or not is_image(file.filename):
        return make_response({'error': "Invalid image file."}, 400)
    try:
        jsonschema.validate(request.form, billing_ticket_validation)
        return BillingTicketController.create_bill(g.session, file, int(request.form["rfo_id"]), request.form["ticket_number"])
    except jsonschema.ValidationError as e:
        print(e)
        return make_response({"error": e.message}, 400)
    except ValueError:
        return make_response({"error": "Value of rfo_id is not a number"})


@billing_ticket.route("/<int:bill_id>", methods=["PUT"])
@login_required
def update_bill(bill_id):
    if request.mimetype != 'multipart/form-data':
        return make_response({"error": "Content type must be multipart/form-data"}, 400)

    file = None
    if 'file' in request.files:
        file = request.files['file']
        if not is_image(file.filename):
            return make_response({'error': "Invalid image file."}, 400)

    try:
        jsonschema.validate(request.form, billing_ticket_upate)
        return BillingTicketController.update_bill(g.session, bill_id, request.form["ticket_number"], file)
    except jsonschema.ValidationError as e:
        return make_response({"error": e.message}, 400)


@billing_ticket.route("/<int:bill_id>", methods=["DELETE"])
@login_required
def delete_bill(bill_id):
    return BillingTicketController.delete_bill(g.session, bill_id)


@billing_ticket.route("/operator", methods=["GET"])
def operator_get_rfo():
    auth_header = request.headers.get('Authorization')
    if not auth_header or 'Bearer' not in auth_header:
        return make_response({'error': 'Bearer token required.'}, 401)
    # Split the token from the Bearer
    token = auth_header.split(' ')[1]
    return BillingTicketController.operator_get_billing_tickets(g.session, token)


@billing_ticket.route("/<int:bill_id>/image", methods=["GET"])
@login_required
def get_bill_image(bill_id):
    return BillingTicketController.get_bill_ticket_image(g.session, bill_id)
