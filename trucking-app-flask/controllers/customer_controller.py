from utils import make_response
from flask_login import current_user
from sqlalchemy import and_
from models import Company, Customer


class CustomerController:

    def create_customer(session, request):

        return make_response({"message": "Customer created successfully"}, 201)

    def get_customer(session, customer_id):
        # get the customer
        customer = Customer.get_customer_by_id_and_owner(
            session, customer_id, current_user.id)

        # See if the customer exists
        if not customer:
            return make_response({"message": "Customer not found"}, 404)

        # return the customer
        return make_response(customer.to_dict(), 200)

    def update_customer(session, request, customer_id):
        return make_response({"message": "Updated successfully"}, 201)

    def delete_customer(session, customer_id):
        return make_response({"message": "Deleted successfully"}, 201)
