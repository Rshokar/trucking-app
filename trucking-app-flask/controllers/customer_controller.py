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
        session.add(customer)
        session.commit()
        return make_response(customer.to_dict(), 201)

    def update_customer(session, request, customer_id):
        return make_response({"message": "Updated successfully"}, 201)

    def delete_customer(session, customer_id):
        # get the company
        # company = session.query(Company).filter_by(company_id=company_id)
        # if not company:
        #     abort(404, description="Company not found")
        # # get the customer
        # customer = session.query(Customer).filter(and_(
        #     Customer.company_id.like(company_id),
        #     Customer.customer_id.like(customer_id)
        # )).first()
        # if not customer:
        #     abort(404, description="Customer not found")
        # # check if the customer has any dispatches
        # if customer.dispatches:
        #     customer.deleted = True
        #     session.commit()
        #     return jsonify({"message": f"Customer {customer_id} deleted (marked as deleted due to dependent dispatches)"}), 200
        # # delete the customer
        # session.delete(customer)
        # session.commit()
        # return jsonify({"message": f"Customer {customer_id} deleted from company {company_id}"}), 200
