from typing import Optional, List
from models import Dispatch, Company, Customer, RFO
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from flask import Response,  make_response
from datetime import datetime, timedelta
from flask import g


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
            session, dispatch_id, g.user["uid"])

        if dispatch is None:
            return make_response('Dispatch not found', 404)

        return make_response(dispatch.to_dict(True), 200)

    def get_dispatch_all(session: Session, limit: int, page: int, startDate: Optional[datetime], endDate: Optional[datetime], customers: Optional[List[int]]) -> Response:
        """_summary_

        Args:
            session (_type_): SQL Alchemy Session
            limit (int): Limit of dispatches
            page (int): Page of dispatches
            startDate (datetime): Start date of dispatches
            endDate (datetime): End date of dispatches
            customers (list): List of customers

        Returns:
            Response: 200 success 404 not found
        """

        dispatch_query = session.query(Dispatch, Customer.customer_name, func.count(RFO.rfo_id).label('rfo_count'))\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .outerjoin(RFO, Dispatch.dispatch_id == RFO.dispatch_id)\
            .join(Customer, Dispatch.customer_id == Customer.customer_id)\
            .filter(Company.owner_id == g.user['uid'])

        if not customers:
            dispatch_query = dispatch_query.filter(
                Dispatch.date >= startDate,
                Dispatch.date <= endDate
            )
        else:
            dispatch_query = dispatch_query.filter(
                Dispatch.customer_id.in_(customers),
                Dispatch.date >= startDate,
                Dispatch.date <= endDate
            )

        dispatches = dispatch_query.group_by(Dispatch.dispatch_id)\
            .limit(limit).offset(page * limit).all()

        result = []
        for dispatch, customer, rfo_count in dispatches:
            result.append({
                "dispatch_id": dispatch.dispatch_id,
                "company_id": dispatch.company_id,
                "customer_id": dispatch.customer_id,
                "notes": dispatch.notes,
                "date": dispatch.date.isoformat(),
                "expiry": dispatch.expiry.isoformat(),
                "customer": {"customer_name": customer},
                "rfo_count": rfo_count,
            })
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
            session, customer_id, g.user["uid"])

        if customer is None:
            return make_response('Customer not found', 404)

        if customer.company_id != company_id:
            return make_response('Company not found', 404)

        dispatch = Dispatch(
            company_id, customer_id, notes, datetime.strptime(date, "%Y-%m-%d"))

        session.add(dispatch)
        session.commit()
        return make_response(dispatch.to_dict(True), 201)

    def update_dispatch(session, request, dispatch_id):
        """_summary_
            Updates a dispatch
        Args:
            session (_type_): SQL Alchemy Session
            request (_type_): API Request
        """

        data = request.json

        dispatch = Dispatch.get_dispatch_by_id_and_owner(
            session, dispatch_id, g.user["uid"])

        if dispatch is None:
            return make_response('Dispatch not found', 404)

        date = datetime.strptime(
            data.get("date"), "%Y-%m-%d").date()

        expiry = datetime.strptime(
            data.get("expiry"), "%Y-%m-%d").date()

        if expiry < date:
            return make_response("Expiry must be after date", 400)

        dispatch.notes = data.get('notes')
        dispatch.customer_id = data.get('customer_id')
        dispatch.expiry = expiry.isoformat()
        dispatch.date = date.isoformat()

        print(dispatch.expiry)
        print(dispatch.date)

        session.commit()

        res = dispatch.to_dict(True)
        print(res)
        return make_response(res, 200)

    def delete_dispatch(session, dispatch_id):
        """_summary_
            Delete a dispatch
        Args:
            session (_type_): SQL Alchemy Session
            dispatch_id (int): Dispatch Id
        """
        dispatch = Dispatch.get_dispatch_by_id_and_owner(
            session, dispatch_id, g.user["uid"])

        if dispatch is None:
            return make_response('Dispatch not found', 404)

        try:
            session.delete(dispatch)
            session.commit()
            return make_response('Dispatch deleted successfully', 200)
        except IntegrityError:
            session.rollback()
            return make_response('Tickets exist that reference dispatch. Dispatch cannot be deleted.', 400)
