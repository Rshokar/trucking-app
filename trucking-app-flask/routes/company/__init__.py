from .company import company
from .customers import customers
company.register_blueprint(customers, url_prefix="/customers")