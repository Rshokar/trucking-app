from .inotification_service import INotificationService
from config import twilio_client
import os
TWILIO_PHONE_NUMBER = os.environ["TWILIO_PHONE_NUMBER"]
WEB_URL = os.environ["WEB_URL"]
class SMSNotificationService(INotificationService):
    def send_operator_verification(self, operator, token, company_name):
        
        
        # Ideally, you should use url_for function of Flask to create verify URL
        verify_url = f"{WEB_URL}/validate_email/{token}/operator"
        
        message = twilio_client.messages.create(
            body=f"""
            Hello {operator.operator_name},

            This is a message from Tare and {company_name}. {company_name} wants to add you to their operator list. Before they can send you a dispatch we need to verify your phone number. Please click the link bellow.  

            {verify_url}

            Regards,

            Tare and {company_name}
            """,
            from_=TWILIO_PHONE_NUMBER,
            to='+16048309200'
        )

        print(message.sid)
        
        
    def send_operator_verification_update_contact_method(self, operator, token, company_name):
        
        
                # Ideally, you should use url_for function of Flask to create verify URL
        verify_url = f"{WEB_URL}/validate_email/{token}/operator"
        
        message = twilio_client.messages.create(
            body=f"""
            Hello {operator.operator_name},

            This is a message from Tare and {company_name}. {company_name} has updated your contact method. Before they can send you a dispatch we need to verify your phone number. Please click the link bellow.  

            {verify_url}

            Regards,

            Tare and {company_name}
            """,
            from_=TWILIO_PHONE_NUMBER,
            to='+16048309200'
        )

        print(message.sid)