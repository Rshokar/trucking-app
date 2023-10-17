from flask_mail import Mail
from flask import current_app as app, make_response
from utils import send_contact_form_email

class ContactUsController:

    def create_contact_us_email(request):
        req = request.get_json()

        mail = Mail(app)
        body = req.get('body')
        name = req.get('name')
        sender_email = req.get('email')

        try:
            send_contact_form_email(mail, body, name, sender_email)
            return make_response("Success", 201)
        except Exception as e:
            print(e)