from utils import make_response
from flask_login import current_user
from sqlalchemy import and_
from models import Company, Customer


class CustomerController:

    def create_customer(session, request):
        return make_response({"message": "Customer created successfully"}, 201)

    def get_customer(session, customer_id):
        return make_response({"message": "Got Customer"}, 201)

    def update_customer(session, request, customer_id):
        return make_response({"message": "Updated successfully"}, 201)

    def delete_customer(session, customer_id):
        return make_response({"message": "Deleted successfully"}, 201)
