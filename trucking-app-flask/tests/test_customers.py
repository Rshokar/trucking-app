import pytest
import json
from config_test import app, client, session
from models.customer import Customer
END_POINT = "customer"


def test_customer_post(client, session):
    company_id = 1
    customer_name = "Test Customer"

    response = client.post(
        f"/company/${company_id}/{END_POINT}",
        data=json.dumps({"name": customer_name}),
        content_type="application/json"
    )

    data = json.loads(response.data)

    assert response.status_code == 201
    assert "customer_id" in data.keys()
    assert type(data["customer_id"]) == int
    assert "company_id" in data.keys()
    assert data["company_id"] == company_id
    assert "customer_name" in data.keys()
    assert data["customer_name"] == customer_name


def test_customer_post_validation(client, session):
    # Test missing fields
    response = client.post(f"/company/1/customers/${END_POINT}", json={})
    data = json.loads(response.data)
    assert response.status_code == 400
    assert "error" in data.keys()
    assert "company_id" in data["error"]
    assert "customer_name" in data["error"]

    # Test invalid company_id
    response = client.post(
        "/customer", json={"company_id": "not_an_integer", "customer_name": "Test Customer"})
    data = json.loads(response.data)
    assert response.status_code == 400
    assert "error" in data.keys()
    assert "company_id" in data["error"]

    # Test empty customer_name
    response = client.post(
        "/customer", json={"company_id": 1, "customer_name": ""})
    data = json.loads(response.data)
    assert response.status_code == 400
    assert "error" in data.keys()
    assert "customer_name" in data["error"]
