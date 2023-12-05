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
        
        
    def send_operator_rfo(self, rfo, operator, dispatch, company, token):
        '''
        Send a link to RFO to operator

        Parameters:
            rfo (RFO): Request for Operator
            operator (OPERATOR): Operator Object
            company (COMPANY): company Object
            customer (CUSTOMER): customer Object
            token (string): Time serialized token containing rfo information
        '''
        
        # Provide default 'Null' value if location details are not available
        start_location = rfo.start_location if rfo.start_location else 'Null'
        load_location = rfo.load_location if rfo.load_location else 'Null'
        dump_location = rfo.dump_location if rfo.dump_location else 'Null'

        # Format datetime objects to a more readable format
        start_time_formatted = rfo.start_time.strftime('%B %d, %Y at %I:%M %p')
        dispatch_date_formatted = dispatch.date.strftime('%B %d, %Y')

        message = f'''
        Hello {operator.operator_name},

        We have a new job for you from {company.company_name} on behalf of {dispatch.customer.customer_name}.

        Job Details:
        Start Time: {start_time_formatted}
        Start Location: {start_location}
        Load Location: {load_location}
        Dump Location: {dump_location}

        Dispatch Details:
        Notes: {dispatch.notes}
        Date: {dispatch_date_formatted}

        Please click on the link below to view more details and accept the job:

        {WEB_URL}/ticket/{token}

        If you have any questions, please contact your dispatcher.

        Regards,
        {company.company_name}
        '''

        message = twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to='+16048309200'
        )