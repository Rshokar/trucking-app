from models import Company, User, Customer, Dispatch, RFO, BillingTickets, Operator, UserTypes
from config.db import Session
from factory import Sequence, SubFactory, Faker, LazyAttribute
from faker import Faker as F
from factory.fuzzy import FuzzyChoice, FuzzyText
from factory.alchemy import SQLAlchemyModelFactory
import random
from config.db import Session

session = Session()

fake = F()


def loadDB(num_users):
    print("LOADING DATABSE WITH RANDOM DATA")

    for index in range(num_users):
        user = UserFactory.create()

        print(f"USER --|--: \n: {user}")

        company = CompanyFactory(owner_id=user.id)

        print(f"COMPANY --|--: \n {company}")

        customers = CustomerFactory.create_batch(
            5, company_id=company.company_id)

        print(f"CUSTOMERS --|--: \n {customers}")

        operators = OperatorFactory.create_batch(
            5, company_id=company.company_id)

        print(f"OPERATORS --|--: \n {operators}")
        dispatches = []
        rfos = []
        billing_tickets = []
        for customer in customers:
            d = DispatchFactory.create_batch(
                5, company_id=company.company_id, customer_id=customer.customer_id)

            for dispatch in d:
                numRfos = random.randint(0, len(operators))
                for i in range(numRfos):
                    rfo = RFOFactory.create(
                        dispatch_id=dispatch.dispatch_id, operator_id=operators[i].operator_id)
                    billing_ticket = BillingTicketFactory.create(
                        rfo_id=rfo.rfo_id)
                    billing_tickets.append(billing_ticket)
                    rfos.append(rfo)

            dispatches.append(d)

        print(f"DISPATCHES --|--: \n {dispatches}")
        print(f"RFO --|--: \n {rfos}")
        print(f"BILLING TICETS --|--: \n {billing_tickets}")


class UserFactory(SQLAlchemyModelFactory):

    class Meta:
        model = User
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    @staticmethod
    def generate_password():
        # generate random password of length 8
        password = fake.password(
            length=8, special_chars=False, digits=True, upper_case=True, lower_case=True)
        while not (any(c.isdigit() for c in password) and any(c.isupper() for c in password) and any(c.islower() for c in password)):
            password = fake.pa('passwor', length=8, special_chars=False,
                               digits=True, upper_case=True, lower_case=True)
        return password

    type = FuzzyChoice([UserTypes.DISPATCHER.value])
    email = Faker('email')
    password = LazyAttribute(lambda obj: UserFactory.generate_password())


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


class DispatchFactory(SQLAlchemyModelFactory):

    class Meta:
        model = Dispatch
        sqlalchemy_session = session
        sqlalchemy_session_persistence = 'commit'

    company_id = SubFactory(CompanyFactory)
    customer_id = SubFactory(CustomerFactory)
    notes = Faker("text", max_nb_chars=200)
    date = Faker("date_time")


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
    start_time = fake.date_of_birth()


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
