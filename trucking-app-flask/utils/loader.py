from models import Company, User, Customer, Dispatch, RFO, BillingTickets, Operator, UserRole
from config.db import Session
from factory import Sequence, SubFactory, Faker, LazyAttribute
from faker import Faker as F
from factory.fuzzy import FuzzyChoice, FuzzyText
from factory.alchemy import SQLAlchemyModelFactory
from datetime import datetime, timedelta
import math
import random
import stripe
import os

STRIPE_API_KEY = os.getenv("STRIPE_SECRET_API_KEY")
stripe.api_key = STRIPE_API_KEY
session = Session()

# Global date range for when RFOS are made
START_DATE = datetime(2023, 9, 1)  # Example start date
END_DATE = datetime(2023, 12, 31)    # Example end date

def random_timestamp(start, end):
    """Return a random Unix timestamp between two datetime objects."""
    random_date = start + timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())))
    return int(random_date.timestamp())

fake = F()

class UserFactory(SQLAlchemyModelFactory):

    class Meta:
        model = User
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    role = FuzzyChoice([UserRole.DISPATCHER.value])
    email = LazyAttribute(lambda o: fake.unique.email())  # Generates a unique email
    id = FuzzyText(length=50)

    # @classmethod
    # def _create(cls, model_class, *args, **kwargs):
    #     # assuming 'email' and 'company_name' are required for the add_customer method
    #     company_name = fake.company()  # Generate a random company name
    #     email = kwargs.get('email')
    #     customer = stripe.Customer.create(name=company_name, email=email)
    #     kwargs['stripe_id'] = customer.id
    #     return super()._create(model_class, *args, **kwargs)



class CompanyFactory(SQLAlchemyModelFactory):

    class Meta:
        model = Company
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    owner_id = SubFactory(UserFactory)
    name = Faker("company")


class CustomerFactory(SQLAlchemyModelFactory):

    class Meta:
        model = Customer
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    company_id = SubFactory(CompanyFactory)
    customer_name = Faker('company')


class OperatorFactory(SQLAlchemyModelFactory):

    class Meta:
        model = Operator
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    company_id = SubFactory(CompanyFactory)
    operator_name = Faker('company')
    operator_email = Faker('email')
    confirm_token = Faker('word')
    confirmed = Faker('boolean')


class DispatchFactory(SQLAlchemyModelFactory):

    class Meta:
        model = Dispatch
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    company_id = SubFactory(CompanyFactory)
    customer_id = SubFactory(CustomerFactory)
    notes = Faker("text", max_nb_chars=200)
    date = LazyAttribute(lambda _: datetime.fromtimestamp(random_timestamp(START_DATE, END_DATE)))


class RFOFactory(SQLAlchemyModelFactory):

    class Meta:
        model = RFO
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    dispatch_id = SubFactory(DispatchFactory)
    operator_id = SubFactory(OperatorFactory)
    trailer = "4-axle Transfer"
    truck = "Tandem"
    start_location = Faker("street_address")
    dump_location = Faker("street_address")
    load_location = Faker("street_address")
    start_time = LazyAttribute(lambda _: datetime.fromtimestamp(random_timestamp(START_DATE, END_DATE)))
    created_at = LazyAttribute(lambda _: random_timestamp(START_DATE, END_DATE))


class BillingTicketFactory(SQLAlchemyModelFactory):

    class Meta:
        model = BillingTickets
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    @staticmethod
    def generate_random_image_id():
        sections = []
        for i in range(4):
            section = ''.join(random.choices(
                '0123456789abcdefghijklmnopqrstuvwxyz', k=6))
            sections.append(section)
        return '-'.join(sections)

    rfo_id = SubFactory(RFOFactory)
    ticket_number = Sequence(lambda n: n + 1)
    image_id = LazyAttribute(
        lambda obj: BillingTicketFactory.generate_random_image_id())



def loadDB(num_users, num_operators, num_customers, num_dispatches):
    print("LOADING DATABASE WITH RANDOM DATA")
    for i in range(num_users):
        company = fake.company()
        email = fake.unique.email()  # Generates a unique email
        stripe_customer = stripe.Customer.create(name=company, email=email)
        # user = UserFactory.create(id='XT6JmAPRALQaGfgWEnjn9RySWAW2', created_at=datetime.now(), email=email, stripe_id=stripe_customer['id'])
        user = UserFactory.create(id="MFmmlrmTQvaTWxAyUNAxfE9dxzk1", created_at=datetime.now(), email=email, stripe_id=stripe_customer['id'])
        company = CompanyFactory.create(owner_id=user.id, name=company)
        
        
        operators = []
        for i in range(num_operators):
            operators.append(OperatorFactory.create(company_id=company.company_id))
            
        customers = []
        for i in range(num_customers):
            customers.append(CustomerFactory.create(company_id=company.company_id))
        
        rfos = []
        for i in range(num_dispatches):
            disp = DispatchFactory(
                company_id=company.company_id, 
                customer_id=customers[random.randint(0, len(customers) - 1)].customer_id
            )    
            for i in range(len(operators)):
                rfos.append(RFOFactory.create(
                    dispatch_id=disp.dispatch_id, 
                    operator_id=operators[i].operator_id
                ))

