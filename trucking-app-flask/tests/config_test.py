import sys
sys.path.append('../')

from app import create_app
import pytest


@pytest.fixture()
def app():
    app = create_app()
    print("NEW APP")
    yield app


@pytest.fixture()
def client(app):
    print("GET CLIENT")
    return app.test_client()
