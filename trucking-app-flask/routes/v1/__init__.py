from flask import Blueprint


from .company import company
from .user import user
from .rfo import rfo
from .dispatch import dispatch
from .auth import auth
from .billing_ticket import billing_ticket
from .contact import contact

v1 = Blueprint('v1', __name__)


v1.register_blueprint(company, url_prefix="/company")
v1.register_blueprint(user, url_prefix="/user")
v1.register_blueprint(rfo, url_prefix="/rfo")
v1.register_blueprint(dispatch, url_prefix="/dispatch")
v1.register_blueprint(auth, url_prefix="/auth")
v1.register_blueprint(billing_ticket, url_prefix="/billing_ticket")
v1.register_blueprint(contact, url_prefix="/contact-us")
