from controllers.contact_us_controller import ContactUsController
from flask import Blueprint, Response, g, request
from flask import Blueprint, Response

contact = Blueprint("contact", __name__)

@contact.route('/contact-us', methods=["POST"])
def send_contact_us_form() -> Response:
    return ContactUsController.create_contact_us_email(request)