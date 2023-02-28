import sys
import os
sys.path.append('../')

# Switch State to test so that app does not create default data
os.environ.setdefault("STATE", 'test')


from app import create_app
from config.db import Session
from utils.loader import UserFactory, CompanyFactory, CustomerFactory, DispatchFactory, OperatorFactory
import pytest


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