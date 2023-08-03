
import json
from flask_login import current_user
from utils import make_response
from flask import Response
from models import BillingTickets, RFO, Dispatch, Company
from sqlalchemy import and_


class BillingTicketController:

    def get_bill(session, bill_id):
        """_summary_
            Gets a single billing ticket from the database
        Args:
            session (_type_): _description_
            bill_id (int): billing ticket id
        Returns:
            Response: 200, 404
        """
        bill = session.query(BillingTickets)\
            .join(RFO, RFO.rfo_id == BillingTickets.rfo_id)\
            .join(Dispatch, Dispatch.dispatch_id == RFO.dispatch_id)\
            .join(Company, Company.company_id == Dispatch.company_id)\
            .filter(and_(BillingTickets.bill_id == bill_id, Company.owner_id == current_user.id))\
            .first()
        if bill is None:
            return make_response({"error": "Billing ticket not found"}, 404)
        return make_response(bill.to_dict(), 200)

    def get_all_bills(session, page: int, limit: int, rfo_id: int):
        """_summary_
            Gets all bills according to id
            If current user is not owner of rfo 
            then 404 is returned
        Args:
            session (_type_): _description_
            page (_type_): _description_
            limit (_type_): _description_
            rfo_id (_type_): _description_
        """
        if rfo_id <= 0:
            return make_response({"error": "RFO ID is required and must be greater than 0"}, 400)

        rfo = None

        rfo = session.query(RFO)\
            .join(Dispatch, RFO.dispatch_id == Dispatch.dispatch_id)\
            .join(Company, Company.company_id == Dispatch.company_id)\
            .where(Company.owner_id == current_user.id)\
            .first()

        if (rfo is None):
            return make_response({"error": "RFO not found"}, 404)

        bills = session.query(BillingTickets)\
            .where(BillingTickets.rfo_id == rfo_id)\
            .limit(limit).offset(page * limit).all()

        res = []

        for bill in bills:
            res.append(bill.to_dict())

        return make_response(res, 200)

    def create_bill(session, request):
        """_summary_
            Creates a billing ticket in the database
        Args:
            request (_type_): _description_
        Returns:
            Response: 201, 400
        """

        data = request.json

        rfo_id = data.get("rfo_id")
        ticket_number = data.get("ticket_number")
        image_id = data.get("image_id", 100)

        rfo = session.query(RFO)\
            .join(Dispatch, RFO.dispatch_id == Dispatch.dispatch_id)\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .filter(and_(RFO.rfo_id == rfo_id, Company.owner_id == current_user.id))\
            .first()

        if rfo is None:
            return make_response({"error": "RFO not found"}, 404)

        bill = BillingTickets(
            rfo_id,
            ticket_number,
            image_id
        )

        session.add(bill)
        session.commit()
        return make_response(bill.to_dict(), 201)

    def update_bill(session, request, bill_id):
        """_summary_
            Updates a billing ticket in the database
        Args:
            session (_type_): _description_
            request (_type_): _description_
            bill_id (int): Billing ticket id

        Returns:
            _type_: _description_
        """

        data = request.json

        bill = session.query(BillingTickets).filter_by(bill_id=bill_id)\
            .join(RFO, RFO.rfo_id == BillingTickets.rfo_id)\
            .join(Dispatch, Dispatch.dispatch_id == RFO.dispatch_id)\
            .join(Company, Company.company_id == Dispatch.company_id)\
            .filter(and_(BillingTickets.bill_id == bill_id, Company.owner_id == current_user.id))\
            .first()
        if bill is None:
            return make_response({"error": "Billing ticket not found"}, 404)

        bill.ticket_number = data.get("ticket_number", bill.ticket_number)
        bill.image_id = data.get("image_id", bill.image_id)
        session.commit()

        return make_response(bill.to_dict(), 200)

    def delete_bill(session, bill_id):
        """_summary_
            Deletes a billing ticket from the database
        Args:
            session (_type_): _description_
            bill_id (_type_): _description_

        Returns:
            _type_: _description_
        """

        bill = session.query(BillingTickets).filter_by(bill_id=bill_id)\
            .join(RFO, RFO.rfo_id == BillingTickets.rfo_id)\
            .join(Dispatch, Dispatch.dispatch_id == RFO.dispatch_id)\
            .join(Company, Company.company_id == Dispatch.company_id)\
            .filter(and_(BillingTickets.bill_id == bill_id, Company.owner_id == current_user.id))\
            .first()

        if bill is None:
            return make_response({"error": "Billing ticket not found"}, 404)
        session.delete(bill)
        session.commit()
        return make_response({"message": "Billing ticket deleted"}, 200)
