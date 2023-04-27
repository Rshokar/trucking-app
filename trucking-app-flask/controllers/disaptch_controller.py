from models import Dispatch, Company, Customer, RFO
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from flask import jsonify
from datetime import datetime, timedelta
from utils import make_response
from flask_login import current_user


class DispatchController:

    def get_dispatch(session, dispatch_id):
        """_summary_

        Args:
            session (_type_): SQL Alchemy Session
            dispatch_id (int): Dispatch ID

        Returns:
            Response: 200 success 404 not found
        """
        dispatch = Dispatch.get_dispatch_by_id_and_owner(
            session, dispatch_id, current_user.id)
        print(f"CURRENT USER: {current_user}")
        if dispatch is None:
            return make_response({'error': 'Dispatch not found'}, 404)
        return make_response(dispatch.to_dict(), 200)

    def get_dispatch_all(session, limit, page, startDate, endDate, customers):
        """_summary_

        Args:
            session (_type_): SQL Alchemy Session
            limit (int): Limit of dispatches
            page (int): Page of dispatches
            startDate (datetime): Start date of dispatches
            endDate (datetime): End date of dispatches
            custmoers (list): List of customers

        Returns:
            Response: 200 success 404 not found
        """

        limit = int(limit) if limit is not None else 10
        page = int(page) if page is not None else 0
        startDate = datetime.strptime(
            startDate, '%Y-%m-%d') if startDate is not None else datetime.now()
        endDate = datetime.strptime(
            endDate, '%Y-%m-%d') + timedelta(days=1) if endDate is not None else startDate + timedelta(days=1)
        customers = customers if customers is not None else []

        print("Parameter types:")
        print("limit:", type(limit))
        print("page:", type(page))
        print("startDate:", type(startDate))
        print("endDate:", type(endDate))
        print("customers:", type(customers))

        dispatch_query = session.query(Dispatch, Customer, func.count(RFO.rfo_id).label('rfo_count'))\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .join(RFO, Dispatch.dispatch_id == RFO.dispatch_id)\
            .join(Customer, Dispatch.customer_id == Customer.customer_id)
        print("CUSTOMERSsssssss: ", customers)

        # query the database using the parameters
        if not customers:  # if the customers array is empty, all ids pass
            dispatch_query = dispatch_query.filter(
                Dispatch.date >= startDate,
                Dispatch.date <= endDate
            )
        else:  # if the customers array is not empty, check if the customer_id is in the array
            print("CUSTOMERS: ", customers)
            dispatch_query = dispatch_query.filter(
                Dispatch.customer_id.in_(customers),
                Dispatch.date >= startDate,
                Dispatch.date <= endDate
            )

        dispatches = dispatch_query.group_by(Dispatch.dispatch_id)\
            .limit(limit).offset(page * limit).all()

        result = []
        for dispatch in dispatches:
            result.append({
                "dispatch_id": dispatch[0].dispatch_id,
                "company_id": dispatch[0].company_id,
                "customer_id": dispatch[0].customer_id,
                "notes": dispatch[0].notes,
                "date": dispatch[0].date,
                "customer": dispatch[1].to_dict(),
                "rfo_count": dispatch[2],
            })

        print(result)
        return make_response(result, 200)

    def create_dispatch(session, request):
        """_summary_

        Args:
            session (_type_): SQL Alchemy Session
            request (_type_): API Reques

        Returns:
            _type_: 201 success
        """
        request_data = request.get_json()
        company_id = request_data.get('company_id')
        customer_id = request_data.get('customer_id')
        notes = request_data.get('notes')
        date = request_data.get('date')

        customer = Customer.get_customer_by_id_and_owner(
            session, customer_id, current_user.id)

        if customer is None:
            return make_response({'error': 'Customer not found'}, 404)

        if customer.company_id != company_id:
            return make_response({'error': 'Company not found'}, 404)

        dispatch = Dispatch(
            company_id, customer_id, notes, datetime.strptime(date, "%Y-%m-%d %H:%M:%S"))

        session.add(dispatch)
        session.commit()
        return make_response(dispatch.to_dict(), 201)

    def update_dispatch(session, request, dispatch_id):
        """_summary_
            Updates a dispatch
        Args:
            session (_type_): SQL Alchemy Session
            request (_type_): API Request
        """

        data = request.json
        notes = data.get('notes')

        dispatch = Dispatch.get_dispatch_by_id_and_owner(
            session, dispatch_id, current_user.id)

        if dispatch is None:
            return make_response({'error': 'Dispatch not found'}, 404)

        dispatch.date = datetime.strptime(
            data.get("date"), "%Y-%m-%d %H:%M:%S")
        dispatch.notes = data.get('notes')

        session.commit()
        return make_response(dispatch.to_dict(), 200)

    def delete_dispatch(session, dispatch_id):
        """_summary_
            Delete a dispatch
        Args:
            session (_type_): SQL Alchemy Session
            dispatch_id (int): Dispatch Id
        """
        dispatch = Dispatch.get_dispatch_by_id_and_owner(
            session, dispatch_id, current_user.id)

        if dispatch is None:
            return make_response({'error': 'Dispatch not found'}, 404)

        try:
            session.delete(dispatch)
            session.commit()
            return make_response({'message': 'Dispatch deleted successfully'}, 200)
        except IntegrityError as e:
            session.rollback()
            return make_response({'error': 'Tickets exist that reference dispatch, cannot delete'}, 400)
