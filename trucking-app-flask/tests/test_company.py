import pytest
import json
from config_test import app, client, session
from models import Company, User
from utils.loader import UserFactory, CompanyFactory
END_POINT = "v1/company"


@pytest.fixture
def company(session): 
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    return company


def test_company_get(client, company):
    response = client.get(f"/{END_POINT}/{company.company_id}")

    data = json.loads(response.data)

    assert response.status_code == 200
    assert "company_id" in data.keys()
    assert type(data["company_id"]) == int
    assert "owner_id" in data.keys()
    assert type(data["owner_id"]) == int
    assert "company_name" in data.keys()


def test_company_get_nonexistent(client):
    response = client.get(f"/{END_POINT}/1000")
    assert response.status_code == 404


def test_company_put(client, company):
    headers = {"Content-Type": "application/json"}
    payload = {"company_name": "AKS Trucking Ltd"}
    response = client.put(
        f"/{END_POINT}/{company.company_id}",
        headers=headers,
        json=payload
    )

    data = json.loads(response.data)

    assert response.status_code == 200
    assert "company_id" in data.keys()
    assert type(data["company_id"]) == int
    assert "owner_id" in data.keys()
    assert type(data["owner_id"]) == int
    assert "company_name" in data.keys()
    assert payload["company_name"] == data["company_name"]


def test_company_put_nonexistent(client):
    headers = {"Content-Type": "application/json"}
    payload = {"company_name": "AKS Trucking Ltd"}
    response = client.put(
        f"/{END_POINT}/1000",
        headers=headers,
        json=payload
    )
    data = json.loads(response.data)

    assert response.status_code == 404
    assert "error" in data.keys()
    assert data["error"] == "Company not found."


def test_company_delete(client, company):
    response = client.delete(f"/{END_POINT}/{company.company_id}")
    assert response.status_code == 204


def test_company_delete_nonexistent(client):
    response = client.delete(f"/{END_POINT}/1000")

    data = json.loads(response.data)

    assert response.status_code == 404
    assert "error" in data.keys()
    assert data["error"] == "Company not found."

