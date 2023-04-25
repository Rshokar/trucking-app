from models import Dispatch, Company, Customer, RFO
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from flask import jsonify
from datetime import datetime
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
        startDate = startDate if startDate is not None else datetime.min
        endDate = endDate if endDate is not None else datetime.max
        customers = customers if customers is not None else []

        query = session.query(Dispatch, func.count(RFO.rfo_id))\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .outerjoin(RFO, Dispatch.dispatch_id == RFO.dispatch_id)
        # query the database using the parameters
        if not customers:  # if the customers array is empty, all ids pass
            query = query.filter(
                Dispatch.date >= startDate,
                Dispatch.date <= endDate
            )
        else:  # if the customers array is not empty, check if the customer_id is in the array
            query = query.filter(
                Dispatch.customer_id.in_(customers),
                Dispatch.date >= startDate,
                Dispatch.date <= endDate
            )

        dispatches = query.group_by(Dispatch.dispatch_id)\
            .limit(limit).offset(page * limit).all()

        print("Dispatches: ", dispatches)
        print("Dispatch: ", dispatches[0])
        return make_response({[dispatch.to_dict() for dispatch in dispatches]}, 200)

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
