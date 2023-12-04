# email_notification_service.py
from flask_mail import Message, Mail
from flask import current_app as app 
import os

WEB_URL = os.environ.get("WEB_URL")

from .inotification_service import INotificationService

class EmailNotificationService(INotificationService):
    def send_operator_verification(self, operator, token, company_name):
        '''
        Send a verification email to a new operator.

        Parameters:
            email (str): The operator's email
            token (str): The operator's unique token
            name (str): The operator's name
        '''
        mail = Mail(app)
        # Send email to operator with the token for verification
        msg = Message(f'{company_name} - Tare Confirm Email',
                    sender='ravindershokar@gmail.com', recipients=[operator.operator_email])

        # Ideally, you should use url_for function of Flask to create verify URL
        verify_url = f"{WEB_URL}/validate_email/{token}/operator"

        msg.body = f'''
        Hello {operator.operator_name},

        {company_name} wants to add you to their operator list.
        
        Please click on the link {verify_url} to verify your email.
        
        Regards,
        
        Tare Ticketing and {company_name}
        '''

        mail.send(msg)
