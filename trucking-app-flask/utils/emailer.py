from flask_mail import Message
import os

WEB_URL = os.environ.get("WEB_URL")


def send_verification_email(mail, email, token, name, company_name):
    '''
    Send a verification email to a new operator.

    Parameters:
        email (str): The operator's email
        token (str): The operator's unique token
        name (str): The operator's name
    '''

    # Send email to operator with the token for verification
    msg = Message(f'{company_name} - Tare Confirm Email',
                  sender='ravindershokar@gmail.com', recipients=[email])

    # Ideally, you should use url_for function of Flask to create verify URL
    verify_url = f"{WEB_URL}/validate_email/{token}/operator"

    msg.body = f'''
    Hello {name},

    {company_name} wants to add you to their operator list.
    
    Please click on the link {verify_url} to verify your email.
    
    Regards,
    
    Tare Ticketing and {company_name}
    '''

    mail.send(msg)


def send_operator_rfo(mail, email, rfo, operator, company, customer, Dispatch, token):
    '''
    Send a link to RFO to operator

    Parameters:
        email (str): The operator's email
        rfo (RFO): Request for Operator
        operator (OPERATOR): Operator Object
        company (COMPANY): company Object
        customer (CUSTOMER): customer Object
    '''

    # Send email to operator with the token for verification
    msg = Message(f'{company.company_name} - {customer.customer_name} - Tare',
                  sender='ravindershokar@gmail.com', recipients=[email])

    # Provide default 'Null' value if location details are not available
    start_location = rfo.start_location if rfo.start_location else 'Null'
    load_location = rfo.load_location if rfo.load_location else 'Null'
    dump_location = rfo.dump_location if rfo.dump_location else 'Null'

    # Format datetime objects to a more readable format
    start_time_formatted = rfo.start_time.strftime('%B %d, %Y at %I:%M %p')
    dispatch_date_formatted = Dispatch.date.strftime('%B %d, %Y')

    msg.body = f'''
    Hello {operator.operator_name},

    We have a new job for you from {company.company_name} on behalf of {customer.customer_name}.

    Job Details:
    Start Time: {start_time_formatted}
    Start Location: {start_location}
    Load Location: {load_location}
    Dump Location: {dump_location}

    Dispatch Details:
    Notes: {Dispatch.notes}
    Date: {dispatch_date_formatted}

    Please click on the link below to view more details and accept the job:

    {WEB_URL}/ticket/{token}

    If you have any questions, please contact your dispatcher.

    Regards,
    {company.company_name}
    '''

    mail.send(msg)


def send_operator_rfo_update(mail, email, rfo, operator, company, customer, Dispatch, token):
    '''
    Send a link to RFO to operator

    Parameters:
        email (str): The operator's email
        rfo (RFO): Request for Operator
        operator (OPERATOR): Operator Object
        company (COMPANY): company Object
        customer (CUSTOMER): customer Object
    '''

    # Send email to operator with the token for verification
    msg = Message(f'{company.company_name} - {customer.customer_name} - Tare',
                  sender='ravindershokar@gmail.com', recipients=[email])

    # Provide default 'Null' value if location details are not available
    start_location = rfo.start_location if rfo.start_location else 'Null'
    load_location = rfo.load_location if rfo.load_location else 'Null'
    dump_location = rfo.dump_location if rfo.dump_location else 'Null'

    # Format datetime objects to a more readable format
    start_time_formatted = rfo.start_time.strftime('%B %d, %Y at %I:%M %p')
    dispatch_date_formatted = Dispatch.date.strftime('%B %d, %Y')

    msg.body = f'''
    Hello {operator.operator_name},

    {company.company_name} has updated your RFO on behalf of {customer.customer_name}.

    Job Details:
    Start Time: {start_time_formatted}
    Start Location: {start_location}
    Load Location: {load_location}
    Dump Location: {dump_location}

    Dispatch Details:
    Notes: {Dispatch.notes}
    Date: {dispatch_date_formatted}

    Please click on the link below to view more details and accept the job:

    {WEB_URL}/operator_auth/{token}/operator

    If you have any questions, please contact your dispatcher.

    Regards,
    {company.company_name}
    '''

    mail.send(msg)


def send_operator_auth_token(mail, email, token, operator_name):
    '''
    Send an authentication token to operator

    Parameters:
        mail (flask_mail.Mail): The Flask-Mail instance
        email (str): The operator's email
        token (str): The authentication token
        operator_name (str): Operator's name
    '''

    # Send email to operator with the token for authentication
    msg = Message(f'Authentication Token - Tare',
                  sender='ravindershokar@gmail.com', recipients=[email])

    msg.body = f'''
    Hello {operator_name},

    You requested access to an RFO assigned to you. 
    
    Enter this code to get access to the RFO (Request For Operator)

    Token: {token}

    Note: This code will expire in 5 minuets. If it expires, request another email.

    If you have any questions, please contact your dispatcher.

    Regards,
    Tare Ticketing
    '''

    mail.send(msg)


def send_user_forgot_password_code(mail, email, code):
    '''
    Send a six-digit password reset code to the user's email.

    Parameters:
        mail (flask_mail.Mail): The Flask-Mail instance
        email (str): The user's email
        code (str): The six-digit password reset code
    '''

    # Constructing the email message
    msg = Message('Password Reset Code - Tare',
                  sender='ravindershokar@gmail.com', recipients=[email])

    msg.body = f'''
    Hello,

    You requested to reset your password for Tare.

    Here's your password reset code: {code}

    Enter this code to continue with the password reset process.

    Note: This code will expire in 10 minutes. If it expires, please request another one.

    If you didn't request this, please ignore this email.

    Regards,
    Tare Ticketing Support
    '''

    # Sending the email
    mail.send(msg)


def send_email_verification(mail, email, token):
    """_summary_

    Args:
        mail (_type_): _description_
        email (_type_): _description_
        token (_type_): _description_
    """

    print("EMAILER")
    msg = Message('Validate Email - Tare',
                  sender='ravindershokar@gmail.com', recipients=[email])

    
    msg.body = f'''
    Hello,

    Thank you creating an account with tare ticketing, and verifying you email. 
    
    Click the link bellow to validate your email. 
    
    link: {WEB_URL}/validate_email/{token}/dispatcher

    Regards,
    Tare Ticketing Support
    '''

    # Sending the email
    mail.send(msg)
def send_contact_form_email(mail, body, name, sender_email):
    msg = Message(f'''Contact Us - {name} - {sender_email}''',
                sender='ravindershokar@gmail.com', recipients=["restarttechnologiesinc@gmail.com"])
    msg.body = f'''
    {body}
    '''

    mail.send(msg)
