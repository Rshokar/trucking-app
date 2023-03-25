if True:
    import sys
    import os
    sys.path.append('../')
    # Switch State to test so that app does not create default data
    os.environ.setdefault("STATE", 'test')

import pytest
from utils.loader import UserFactory, CompanyFactory, CustomerFactory, DispatchFactory, BillingTicketFactory, OperatorFactory, RFOFactory
from config.db import Session
from app import create_app


@pytest.fixture()
def app():
    app = create_app()
    print("NEW APP")
    yield app


@pytest.fixture
def session():
    print("NEW SESSION")
    session = Session()
    yield session
    print("CLOSE SESSION")
    session.rollback()
    session.close()


@pytest.fixture()
def client(app):
    print("GET CLIENT")
    return app.test_client()


@pytest.fixture
def user():
    return UserFactory.create()


@pytest.fixture
def client_authed(client, user):
    print(user)
    res = client.post('/v1/auth/login', json=dict(
        email=user.email,
        password="Testing1"  # UserFactory.DEFAULT_PASSWORD
    ), follow_redirects=True)

    assert 200 == res.status_code

    return client, user


@pytest.fixture
def company():
    user = UserFactory.create()
    return CompanyFactory.create(owner_id=user.id)


@pytest.fixture
def customer():
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    return CustomerFactory.create(company_id=company.company_id)


@pytest.fixture
def dispatch():
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    customer = CustomerFactory.create(company_id=company.company_id)
    return DispatchFactory(
        company_id=company.company_id,
        customer_id=customer.customer_id
    )


@pytest.fixture
def operator():
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    return OperatorFactory.create(company_id=company.company_id)


@pytest.fixture
def operator_dispatch():
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    customer = CustomerFactory.create(company_id=company.company_id)
    dispatch = DispatchFactory(
        company_id=company.company_id,
        customer_id=customer.customer_id
    )
    operator = OperatorFactory.create(company_id=company.company_id)
    return operator, dispatch


@pytest.fixture
def multiple_operator_dispatch():
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    customer_one = CustomerFactory.create(company_id=company.company_id)
    customer_two = CustomerFactory.create(company_id=company.company_id)
    operator_one = OperatorFactory.create(company_id=company.company_id)
    operator_two = OperatorFactory.create(company_id=company.company_id)

    dispatch_one = DispatchFactory(
        company_id=company.company_id, customer_id=customer_one.customer_id)
    dispatch_two = DispatchFactory(
        company_id=company.company_id, customer_id=customer_two.customer_id)

    return [[dispatch_one, operator_one], [dispatch_two, operator_two]]


@pytest.fixture
def rfo():
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    customer = CustomerFactory.create(company_id=company.company_id)
    dispatch = DispatchFactory(
        company_id=company.company_id, customer_id=customer.customer_id)
    operator = OperatorFactory.create(company_id=company.company_id)
    rfo = RFOFactory.create(dispatch_id=dispatch.dispatch_id,
                            operator_id=operator.operator_id)
    return rfo


@pytest.fixture
def billing_ticket():
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    customer = CustomerFactory.create(company_id=company.company_id)
    dispatch = DispatchFactory(
        company_id=company.company_id, customer_id=customer.customer_id)
    operator = OperatorFactory.create(company_id=company.company_id)
    rfo = RFOFactory.create(dispatch_id=dispatch.dispatch_id,
                            operator_id=operator.operator_id)
    billing_ticket = BillingTicketFactory.create(rfo_id=rfo.rfo_id)
    return billing_ticket
