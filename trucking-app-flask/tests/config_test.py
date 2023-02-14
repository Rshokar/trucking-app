import sys
sys.path.append('../')
import pytest
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
    session.rollback()
    session.close()

@pytest.fixture()
def client(app):
    print("GET CLIENT")
    return app.test_client()
