from flask_login import current_user
from itsdangerous import BadTimeSignature, SignatureExpired, URLSafeTimedSerializer
from utils import make_response
from config import s3, create_unique_image_key
from models import BillingTickets, RFO, Dispatch, Company
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
import os
from botocore.exceptions import ClientError
from flask import g

S3_BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')

OPERATOR_ACCESS_TOKEN_SECRET = os.environ.get(
    "OPERATOR_ACCESS_TOKEN_SECRET"
)


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
            .filter(and_(BillingTickets.bill_id == bill_id, Company.owner_id == g.user["uid"]))\
            .first()
        if bill is None:
            return make_response("Billing ticket not found", 404)
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
            return make_response("RFO ID is required and must be greater than 0", 400)

        rfo = None

        rfo = session.query(RFO)\
            .join(Dispatch, RFO.dispatch_id == Dispatch.dispatch_id)\
            .join(Company, Company.company_id == Dispatch.company_id)\
            .where(Company.owner_id == g.user["uid"])\
            .first()

        if (rfo is None):
            return make_response("RFO not found", 404)

        bills = session.query(BillingTickets)\
            .where(BillingTickets.rfo_id == rfo_id)\
            .limit(limit).offset(page * limit).all()

        res = []

        for bill in bills:
            res.append(bill.to_dict())

        return make_response(res, 200)

    def create_bill(session, file, rfo_id: int, ticket_number: str):
        """_summary_
            Creates a billing ticket in the database
        Args:
            request (_type_): _description_
        Returns:
            Response: 201, 400
        """
        print(S3_BUCKET_NAME)
        print(file)
        print(rfo_id)
        print(ticket_number)

        rfo = session.query(RFO)\
            .join(Dispatch, RFO.dispatch_id == Dispatch.dispatch_id)\
            .join(Company, Dispatch.company_id == Company.company_id)\
            .filter(and_(RFO.rfo_id == rfo_id, Company.owner_id == g.user["uid"]))\
            .first()

        if rfo is None:
            return make_response("RFO not found", 404)

        # Generate a unique key for the image
        image_key = create_unique_image_key() + f"_{rfo_id}"

        # Try to upload the image to S3
        try:
            s3.upload_fileobj(
                file,
                S3_BUCKET_NAME,
                image_key,
                ExtraArgs={
                    "ContentType": file.content_type
                }
            )
        except Exception as e:
            return make_response("Failed to upload image to S3: " + str(e), 500)

        # Create the billing ticket with the image key
        bill = BillingTickets(
            rfo_id,
            ticket_number,
            image_key,
            S3_BUCKET_NAME,
            "us-west-2"
        )

        session.add(bill)
        session.commit()
        return make_response(bill.to_dict(), 201)

    def update_bill(session, bill_id, ticket_number, file=None):
        """_summary_
            Updates a billing ticket in the database
        Args:
            session (_type_): _description_
            request (_type_): _description_
            bill_id (int): Billing ticket id

        Returns:
            _type_: _description_
        """

        bill = session.query(BillingTickets).filter_by(bill_id=bill_id)\
            .join(RFO, RFO.rfo_id == BillingTickets.rfo_id)\
            .join(Dispatch, Dispatch.dispatch_id == RFO.dispatch_id)\
            .join(Company, Company.company_id == Dispatch.company_id)\
            .filter(and_(BillingTickets.bill_id == bill_id, Company.owner_id == g.user["uid"]))\
            .first()

        if bill is None:
            return make_response("Billing ticket not found", 404)

        if file:
            # delete the old image if it exists
            try:
                s3.delete_object(Bucket=S3_BUCKET_NAME, Key=bill.image_id)
            except ClientError as e:
                # If the image was not found in S3, we log the exception and continue with updating the bill
                print(
                    f"An exception occurred while deleting the image from S3: {e}")

                # Try to upload the image to S3
            try:

                new_id = create_unique_image_key() + f'_{bill.rfo_id}'
                s3.upload_fileobj(
                    file,
                    S3_BUCKET_NAME,
                    new_id,
                    ExtraArgs={
                        "ContentType": file.content_type
                    }
                )
            except Exception as e:
                return make_response("Failed to upload image to S3: " + str(e), 500)
            bill.image_id = new_id

        bill.ticket_number = ticket_number or bill.ticket_number

        session.commit()

        return make_response(bill.to_dict(), 200)

    def delete_bill(session, bill_id):
        """_summary_
            Deletes a billing ticket from the database and associated image from S3
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
            .filter(and_(BillingTickets.bill_id == bill_id, Company.owner_id == g.user["uid"]))\
            .first()

        if bill is None:
            return make_response("Billing ticket not found", 404)

        # Delete the associated image from S3
        try:
            s3.delete_object(Bucket=S3_BUCKET_NAME,
                             Key=bill.image_id)
        except ClientError as e:
            # If the image was not found in S3, we log the exception and continue with deleting the bill
            return make_response("An error occured while deleting the image", 500)

        # # Delete the bill
        session.delete(bill)
        session.commit()
        return make_response("Billing ticket deleted", 200)

    def operator_get_billing_tickets(session, token):
        '''
        Fetch Bills related to rfo_id in token

        Parameters:
            Session (session): SQLAlchemy db session
            token (str): Token string

        Returns:
            Responses: 200 OK if successful, 400 if token is expired or invalid
        '''
        s = URLSafeTimedSerializer(OPERATOR_ACCESS_TOKEN_SECRET)

        try:
            data = s.loads(token, max_age=86400)  # Token valid for 24 hours
        except SignatureExpired:
            return make_response('Token expired.', 400)
        except BadTimeSignature:
            return make_response('Invalid token.', 400)

        result = session.query(BillingTickets).filter_by(
            rfo_id=data["rfo_id"]
        ).all()

        if not result:
            return make_response('No BillingTickets found for the given RFO.', 404)

        # If there are any results, convert them to dictionary
        response = [billing_ticket.to_dict() for billing_ticket in result]

        return make_response(response, 200)

    def get_bill_ticket_image(session, bill_id: int):
        """Summary: Returns a pre-signed URL to access the image associated with a bill_id
        Args:
            session (Session): The database session
            bill_id (int): The ID of the billing ticket
        Returns:
            Flask Response: A response containing the pre-signed URL or an error message.
        """
        # Query the BillingTickets table for the record with the given bill_id
        bill = session.query(BillingTickets).filter_by(bill_id=bill_id).first()

        if bill is None:
            return make_response("Billing ticket not found", 404)

        try:
            # Generate a pre-signed URL for the S3 object
            url = s3.generate_presigned_url(
                'get_object',
                Params={
                    'Bucket': S3_BUCKET_NAME,
                    'Key': bill.image_id
                },
                ExpiresIn=60  # 1 minute
            )

            # Return the pre-signed URL in the response
            return make_response({"data": url}, 200)

        except Exception as e:
            # Handle any errors that occurred while generating the pre-signed URL
            return make_response("Failed to generate pre-signed URL: " + str(e), 500)

    def operator_create_bill(session, token, file, ticket_number):
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

        s = URLSafeTimedSerializer(OPERATOR_ACCESS_TOKEN_SECRET)

        try:
            data = s.loads(token, max_age=86400)  # Token valid for 24 hours
        except SignatureExpired:
            return make_response('Token expired.', 400)
        except BadTimeSignature:
            return make_response('Invalid token.', 400)

        # Generate a unique key for the image
        image_key = create_unique_image_key() + f"_{data['rfo_id']}"

        # Create the billing ticket with the image key

        try:
            bill = BillingTickets(
                data['rfo_id'],
                ticket_number,
                image_key,
                S3_BUCKET_NAME,
                "us-west-2"
            )

            session.add(bill)
            session.commit()
        except IntegrityError as e:
            return make_response("RFO not found", 404)
            # Try to upload the image to S3
        try:
            s3.upload_fileobj(
                file,
                S3_BUCKET_NAME,
                image_key,
                ExtraArgs={
                    "ContentType": file.content_type
                }
            )
        except Exception as e:
            session.delete(bill)
            return make_response("Failed to upload image to S3: " + str(e), 500)

        return make_response(bill.to_dict(), 201)

    def operator_delete_bill(session, token, bill_id):
        """_summary_

        Args:
            session (_type_): data base session
            token (stirng): access token
            bill_id (number): bill primary key
        """

        s = URLSafeTimedSerializer(OPERATOR_ACCESS_TOKEN_SECRET)

        try:
            data = s.loads(token, max_age=86400)  # Token valid for 24 hours
        except SignatureExpired:
            return make_response('Token expired.', 400)
        except BadTimeSignature:
            return make_response('Invalid token.', 400)

        bill = session.query(BillingTickets)\
            .filter(and_(BillingTickets.bill_id == bill_id, BillingTickets.rfo_id == data["rfo_id"]))\
            .first()

        if bill is None:
            return make_response("Billing ticket not found", 404)

        # Delete the associated image from S3
        try:
            s3.delete_object(Bucket=S3_BUCKET_NAME,
                             Key=bill.image_id)
        except ClientError as e:
            # If the image was not found in S3, we log the exception and continue with deleting the bill
            return make_response("An error occured while deleting the image", 500)

        # # Delete the bill
        session.delete(bill)
        session.commit()
        return make_response("Billing ticket deleted", 204)

    def operator_update_bill(session, token, bill_id, ticket_number):
        """_summary_

        Args:
            session (_type_): data base session
            token (stirng): access token
            bill_id (number): bill primary key
        """

        s = URLSafeTimedSerializer(OPERATOR_ACCESS_TOKEN_SECRET)

        try:
            data = s.loads(token, max_age=86400)  # Token valid for 24 hours
        except SignatureExpired:
            return make_response('Token expired.', 400)
        except BadTimeSignature:
            return make_response('Invalid token.', 400)

        bill = session.query(BillingTickets)\
            .filter(and_(BillingTickets.bill_id == bill_id, BillingTickets.rfo_id == data["rfo_id"]))\
            .first()

        if bill is None:
            return make_response("Bill not found", 404)

        bill.ticket_number = ticket_number

        session.commit()
        return make_response("Billing ticket updated", 200)
