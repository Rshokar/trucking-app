from sqlalchemy.exc import IntegrityError
from flask import g, make_response
from sqlalchemy import and_
from models import Company, Customer


class CustomerController:

    def get_customer(session, customer_id):
        # get the customer
        customer = Customer.get_customer_by_id_and_owner(
            session, customer_id, g.user["uid"])

        # See if the customer exists
        if not customer:
            return make_response("Customer not found", 404)

        # return the customer
        return make_response(customer.to_dict(), 200)

    def get_all_customers(session, page, limit):
        """
        Get all customers owned by the current user.

        Args:
            session (Session): SQLAlchemy session
            page (int): Page number to fetch for pagination
            limit (int): Number of customers to fetch per page

        Returns:
            list of dict: List of dictionaries containing customer data
        """
        # Calculate the starting point
        offset = page * limit

        # Query all customers owned by the current user
        customers = session.query(Customer)\
            .join(Company, Company.company_id == Customer.company_id)\
            .filter(Company.owner_id == g.user["uid"])\
            .order_by(Customer.customer_name.asc())\
            .offset(offset).limit(limit).all()

        # Convert customers to dictionary
        customers_dict = [customer.to_dict() for customer in customers]

        return make_response(customers_dict, 200)

    def create_customer(session, request):

        # get attributes from request
        data = request.get_json()
        company_id = data.get("company_id")
        customer_name = data.get("customer_name")
        # See if the currently logged in user owns the company
        comp = session.query(Company).filter_by(
            owner_id=g.user["uid"]).first()
        if not comp:
            return make_response("Company not found", 404)

        # create the customer
        customer = Customer(company_id=comp.company_id,
                            customer_name=customer_name)

        try:
            session.add(customer)
            session.commit()
            return make_response(customer.to_dict(), 201)
        except IntegrityError:
            return make_response("Customer already exists", 400)

    def delete_customer(session, customer_id):

        # get the customer
        customer = Customer.get_customer_by_id_and_owner(
            session, customer_id, g.user["uid"])

        # See if the customer exists
        if not customer:
            return make_response("Customer not found", 404)

        # delete the customer
        try:
            session.delete(customer)
            session.commit()
            return make_response(f"Customer {customer_id} deleted", 201)
        except IntegrityError:
            session.rollback()
            return make_response("Cannot delete customer because of dependent records", 400)

    def update_customer(session, request, customer_id):

        # Get the customer
        customer = Customer.get_customer_by_id_and_owner(
            session, customer_id, g.user["uid"])

        if not customer:
            return make_response("Customer not found", 404)

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
            return make_response("Customer name already exist", 400)
