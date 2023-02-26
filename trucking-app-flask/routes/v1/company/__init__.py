from .company import company
from .customers import customers
from .operator import operators
company.register_blueprint(customers, url_prefix="/customers")
company.register_blueprint(operators, url_prefix="/operators")