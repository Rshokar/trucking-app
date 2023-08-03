from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired


# You should place this key in your config file
s = URLSafeTimedSerializer('Your_secret_key')


def send_verification_email(mail, email, token, name):
    '''
    Send a verification email to a new operator.

    Parameters:
        email (str): The operator's email
        token (str): The operator's unique token
        name (str): The operator's name
    '''

    # Send email to operator with the token for verification
    msg = Message('Confirm Email',
                  sender='ravindershokar@gmail.com', recipients=[email])

    # Ideally, you should use url_for function of Flask to create verify URL
    verify_url = f"http://localhost:5000/v1/company/operators/validate?token={token}"

    msg.body = f'Hi {name},\nPlease click on the link {verify_url} to verify your email.'
    mail.send(msg)
