import sys
import os
sys.path.append('../')

# Switch State to test so that app does not create default data
os.environ.setdefault("STATE", 'test')


from app import create_app
from config.db import Session
from utils.loader import UserFactory, CompanyFactory, CustomerFactory
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
    user = UserFactory.create()
    return user

@pytest.fixture
def company(): 
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    return company

@pytest.fixture
def customer():
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    customer = CustomerFactory.create(company_id=company.company_id)
    return customer