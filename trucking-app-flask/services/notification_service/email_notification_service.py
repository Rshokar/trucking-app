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

        This is a message from Tare and {company_name}. {company_name} wants to add you to their operator list. Before they can send you a dispatch we need to verify your email. Please click the link bellow.  

        {verify_url}

        Regards,

        Tare and {company_name}
        '''

        mail.send(msg)


    def send_operator_verification_update_contact_method(self, operator, token, company_name):
        """_summary_
        Send a verfication email to a user notifying them that there contact information has changed.

        Parameters:
            email (str): The operator's email
            token (str): The operator's unique token
            name (str): The operator's name
        """
        
        mail = Mail(app)
        # Send email to operator with the token for verification
        msg = Message(f'{company_name} - Tare Confirm Email',
                    sender='ravindershokar@gmail.com', recipients=[operator.operator_email])

        # Ideally, you should use url_for function of Flask to create verify URL
        verify_url = f"{WEB_URL}/validate_email/{token}/operator"

        msg.body = f'''
        Hello {operator.operator_name},

        This is a message from Tare and {company_name}. {company_name} has updated your contact method. Before they can send you a dispatch we need to verify your email. Please click the link bellow.  

        {verify_url}

        Regards,

        Tare and {company_name}
        '''

        mail.send(msg)
        
        
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

        mail = Mail(app)
        # Send email to operator with the token for verification
        msg = Message(f'{company.company_name} - {dispatch.customer.customer_name} - Tare',
                    sender='ravindershokar@gmail.com', recipients=[operator.operator_email])

        # Provide default 'Null' value if location details are not available
        start_location = rfo.start_location if rfo.start_location else 'Null'
        load_location = rfo.load_location if rfo.load_location else 'Null'
        dump_location = rfo.dump_location if rfo.dump_location else 'Null'

        # Format datetime objects to a more readable format
        start_time_formatted = rfo.start_time.strftime('%B %d, %Y at %I:%M %p')
        dispatch_date_formatted = dispatch.date.strftime('%B %d, %Y')

        msg.body = f'''
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

        mail.send(msg)
        
    def send_operator_rfo_update(self, rfo, operator, dispatch, company, token):  
        '''
        Send a link to RFO to operator

        Parameters:
            rfo (RFO): Request for Operator
            operator (OPERATOR): Operator Object
            company (COMPANY): company Object
            customer (CUSTOMER): customer Object
            token (string): Time serialized token containing rfo information
        '''        
        mail = Mail(app)

        # Send email to operator with the token for verification
        msg = Message(f'{company.company_name} - {dispatch.customer.customer_name} - Tare',
                    sender='ravindershokar@gmail.com', recipients=[operator.operator_email])

        # Provide default 'Null' value if location details are not available
        start_location = rfo.start_location if rfo.start_location else 'Null'
        load_location = rfo.load_location if rfo.load_location else 'Null'
        dump_location = rfo.dump_location if rfo.dump_location else 'Null'

        # Format datetime objects to a more readable format
        start_time_formatted = rfo.start_time.strftime('%B %d, %Y at %I:%M %p')
        dispatch_date_formatted = dispatch.date.strftime('%B %d, %Y')

        msg.body = f'''
        Hello {operator.operator_name},

        {company.company_name} has updated your RFO on behalf of {dispatch.customer.customer_name}.

        Job Details:
        Start Time: {start_time_formatted}
        Start Location: {start_location}
        Load Location: {load_location}
        Dump Location: {dump_location}

        dispatch Details:
        Notes: {dispatch.notes}
        Date: {dispatch_date_formatted}

        Please click on the link below to view more details and accept the job:

        {WEB_URL}/operator_auth/{token}/operator

        If you have any questions, please contact your dispatcher.

        Regards,
        {company.company_name}
        '''

        mail.send(msg)
