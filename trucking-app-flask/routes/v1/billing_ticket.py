from flask import Blueprint, g, request
from controllers.billing_ticket_controller import BillingTicketController
import jsonschema
from utils import make_response
from validations import billing_ticket_validation, billing_ticket_upate, operator_billing_ticket_validation
from config import is_image
from middleware import firebase_required, operator_auth

billing_ticket = Blueprint("billing_ticket", __name__)


@billing_ticket.route("/", methods=["GET"])
@firebase_required
def get_all_bills():
    # Get params and set deafults
    limit = int(request.args.get('limit', 10))
    page = int(request.args.get('page', 0))
    rfo_id = int(request.args.get('rfo_id', 0))

    return BillingTicketController.get_all_bills(g.session, page, limit, rfo_id)


@billing_ticket.route("/<int:bill_id>", methods=["GET"])
@firebase_required
def get_bill(bill_id):
    return BillingTicketController.get_bill(session=g.session, bill_id=bill_id)


@billing_ticket.route("/", methods=["POST"])
@firebase_required
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
@firebase_required
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
@firebase_required
def delete_bill(bill_id):
    return BillingTicketController.delete_bill(g.session, bill_id)


@billing_ticket.route("/<int:bill_id>/image", methods=["GET"])
@firebase_required
def get_bill_image(bill_id):
    return BillingTicketController.get_bill_ticket_image(g.session, bill_id)


@billing_ticket.route("/operator/image/<int:bill_id>", methods=["GET"])
def operator_get_bill_image(bill_id):
    authhead = request.headers.get("Authorization-Fake-X", None)

    if authhead is None:
        return make_response("Auth header missing", 400)

    access_token = authhead.split(" ")[1]

    return BillingTicketController.operator_get_bill_ticket_image(g.session, access_token, bill_id)


@billing_ticket.route("/operator", methods=["POST"])
@billing_ticket.route("/operator/<int:bill_id>", methods=["DELETE", "PATCH"])
@operator_auth
def operator_manage_bill(bill_id=None):
    if (bill_id is None and (request.method == 'DELETE' or request.method == 'PATCH')):
        return make_response("Bill id is required", 400)

    # If method is delete, delete bill
    if request.method == "DELETE":
        return BillingTicketController.operator_delete_bill(g.session, g.data, bill_id)

    if request.mimetype != 'multipart/form-data':
        return make_response({"error": "Content type must be multipart/form-data"}, 400)

    ticket_number = request.form.get("ticket_number")
    if not ticket_number:
        return make_response({"error": "Ticket number is missing."}, 400)

    if request.method == "PATCH":
        try:
            jsonschema.validate(request.form, billing_ticket_upate)
            return BillingTicketController.operator_update_bill(g.session, g.data, bill_id, ticket_number)
        except jsonschema.ValidationError as e:
            return make_response({"error": e.message}, 400)

    file = None
    if 'file' in request.files:
        file = request.files['file']
        if not is_image(file.filename):
            return make_response({'error': "Invalid image file."}, 400)

    try:
        jsonschema.validate(request.form, operator_billing_ticket_validation)
        return BillingTicketController.operator_create_bill(g.session, g.data, file, ticket_number)
    except jsonschema.ValidationError as e:
        return make_response({"error": e.message}, 400)
