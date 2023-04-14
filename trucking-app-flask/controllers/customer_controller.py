from sqlalchemy.exc import IntegrityError
from utils import make_response
from flask_login import current_user
from sqlalchemy import and_
from models import Company, Customer


class CustomerController:

    def get_customer(session, customer_id):
        # get the customer
        customer = Customer.get_customer_by_id_and_owner(
            session, customer_id, current_user.id)

        # See if the customer exists
        if not customer:
            return make_response({"message": "Customer not found"}, 404)

        # return the customer
        return make_response(customer.to_dict(), 200)

    def create_customer(session, request):

        # get attributes from request
        data = request.get_json()
        company_id = data.get("company_id")
        customer_name = data.get("customer_name")

        # See if the currently logged in user owns the company
        comp = session.query(Company).filter_by(
            owner_id=current_user.id).first()

        if not comp or comp.company_id != company_id:
            return make_response({"message": "Company not found"}, 404)

        # create the customer
        customer = Customer(company_id=comp.company_id,
                            customer_name=customer_name)

        try:
            session.add(customer)
            session.commit()
            return make_response(customer.to_dict(), 201)
        except IntegrityError as e:
            print("Exception tyoe: ", type(e))
            return make_response({"message": "Customer already exists"}, 400)

    def delete_customer(session, customer_id):

        # get the customer
        customer = Customer.get_customer_by_id_and_owner(
            session, customer_id, current_user.id)

        # See if the customer exists
        if not customer:
            return make_response({"message": "Customer not found"}, 404)

        # check if the customer has any dispatches
        if customer.dispatches:
            # if there are related dispatches, mark the customer as deleted
            customer.deleted = True
            session.commit()
            return make_response({"message": f"Customer {customer_id} deleted (marked as deleted due to dependent dispatches)"}, 200)

        # delete the customer
        try:
            session.delete(customer)
            session.commit()
            return make_response({"message": f"Customer {customer_id} deleted"}, 200)
        except IntegrityError:
            session.rollback()
            return make_response({"error": "Cannot delete customer because of dependent records"}, 400)

    def update_customer(session, request, customer_id):

        # Get the customer
        customer = Customer.get_customer_by_id_and_owner(
            session, customer_id, current_user.id)

        if not customer:
            return make_response({"message": "Customer not found"}, 404)

        # Get the attributes from the request
        data = request.get_json()
        customer.customer_name = data.get(
            "customer_name", customer.customer_name)
        customer.deleted = data.get("deleted", customer.deleted)

        # Update the customer
        try:
            session.commit()
            return make_response(customer.to_dict(), 201)
        except IntegrityError as e:
            session.rollback()
            return make_response({"error", "Customer name already exist"}, 400)
