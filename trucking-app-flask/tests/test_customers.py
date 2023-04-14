import pytest
import json
from config_test import app, client, session, customer, company, client_authed, user, dispatch
from utils.loader import CompanyFactory, CustomerFactory, DispatchFactory, OperatorFactory
END_POINT = "v1/company/customers"


def test_customer_get(client_authed):
    """_summary_
        Get a customer
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)

    # Act
    res = client.get(f"/{END_POINT}/{cust.customer_id}")

    # Assert
    assert res.status_code == 200
    data = json.loads(res.data)
    assert "customer_id" in data.keys()
    assert type(data["customer_id"]) == int
    assert "company_id" in data.keys()
    assert data["company_id"] == comp.company_id
    assert "customer_name" in data.keys()
    assert data["customer_name"] == cust.customer_name


def test_customer_get_invalid_attributes(client_authed):
    """_summary_
        Get a customer with invalid attributes
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)

    # Act
    res = client.get(f"/{END_POINT}/abc")

    # Assert
    assert res.status_code == 404


def test_customer_get_missing_attributes(client_authed):
    """_summary_
        Get a customer with missing attributes
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)

    # Act
    res = client.get(f"/{END_POINT}/")

    # Assert
    assert res.status_code == 405


def test_customer_get_unauthorized_user(client, customer):
    """_summary_
        Get a customer with an unauthorized user
    Args:
        client (app client): un authorized client
        customer (Customer): customer object
    """
    # Arrange

    # Act
    res = client.get(f"/{END_POINT}/{customer.customer_id}")

    # Assert
    assert res.status_code == 401


def test_customer_get_another_users_customer(client_authed, customer):
    """_summary_
        Get a customer with an unauthorized company
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
        customer (Customer): customer object
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)

    # Act
    res = client.get(f"/{END_POINT}/{customer.customer_id}")

    # Assert
    assert res.status_code == 404


def test_customer_post(client_authed):
    """
    Test valid customer post
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    payload = {
        "customer_name": "Test Customer",
        "company_id": comp.company_id
    }

    # Act
    response = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert response.status_code == 201
    data = json.loads(response.data)
    print(data)
    assert "customer_id" in data.keys()
    assert type(data["customer_id"]) == int
    assert "company_id" in data.keys()
    assert data["company_id"] == comp.company_id
    assert "customer_name" in data.keys()
    assert data["customer_name"] == "Test Customer"


def test_customer_post_invalid_attributes(client_authed):
    """
    Test invalid customer post
    """
    # Arrange (empty customer_name)
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    payload = {
        "customer_name": "",
        "company_id": comp.company_id
    }

    # Act
    response = client.post(f"/{END_POINT}/abc", json=payload)

    # Assert
    assert response.status_code == 404

    # Arrange (empty company_id)
    payload = {
        "customer_name": "Test Customer",
        "company_id": ""
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert

    # Arrange (invalid company_id)
    payload = {
        "customer_name": "Test Customer",
        "company_id": "abc"
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400

    # Arrange (too long customer_name)
    payload = {
        "customer_name": "a" * 100,
        "company_id": comp.company_id
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400


def test_customer_post_missing_attributes(client_authed):
    """
    Test missing customer post attributes
    """
    # Arrange (missing company_id)
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    payload = {
        "customer_name": "Test Customer",
    }

    # Act
    response = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert response.status_code == 400
    data = json.loads(response.data)
    assert "error" in data.keys()

    # Arrange (missing customer_name)
    payload = {
        "company_id": comp.company_id
    }

    # Act
    response = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert response.status_code == 400
    data = json.loads(response.data)
    assert "error" in data.keys()


def test_customer_post_unauthorized_user(client, customer):
    """
    Test customer post with an unauthorized user
    """
    # Arrange
    payload = {
        "customer_name": "Test Customer",
        "company_id": customer.company_id
    }

    # Act
    response = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert response.status_code == 401


def test_customer_post_another_users_company(client_authed, customer):
    """
    Test customer post with an unauthorized company
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    payload = {
        "customer_name": "Test Customer",
        "company_id": customer.company_id
    }

    # Act
    response = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert response.status_code == 404


def test_customer_post_ducplicate_customer(client_authed):
    """_summary_
    Test customer post with duplicate customer name
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    customer = CustomerFactory.create(company_id=comp.company_id)
    payload = {
        "customer_name": customer.customer_name,
        "company_id": comp.company_id
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400


def test_customer_delete(client_authed):
    """_summary_
    Test customer delete
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)

    # Act
    response = client.delete(f"/{END_POINT}/{cust.customer_id}")

    # Assert
    assert response.status_code == 200


def test_customer_delete_invalid_id(client_authed):
    """_summary_
    Test customer delete with invalid id
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)

    # Act
    response = client.delete(f"/{END_POINT}/abc")

    # Assert
    assert response.status_code == 404


def test_customer_delete_missing_id(client_authed):
    """_summary_
    Test customer delete with missing id
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)

    # Act
    res = client.delete(f"/{END_POINT}/")

    # Assert
    assert res.status_code == 405


def test_customer_delete_unauthorized_user(client, customer):
    """_summary_
    Test customer delete with an unauthorized user
    Args:
        client (app): the app client
        customer (Customer): a customer object
    """
    # Arrange

    # Act
    response = client.delete(f"/{END_POINT}/{customer.customer_id}")

    # Assert
    assert response.status_code == 401


def test_customer_delete_customer_with_dispatches(client_authed):
    """_summary_
    Test customer delete with dispatches
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)
    DispatchFactory.create(customer_id=cust.customer_id,
                           company_id=comp.company_id)

    # Act
    response = client.delete(f"/{END_POINT}/{cust.customer_id}")
    res = client.get(f"/{END_POINT}/{cust.customer_id}")

    # Assert
    assert response.status_code == 200
    assert res.status_code == 200

    data = json.loads(res.data)
    print(data)
    assert data["customer_id"] == cust.customer_id
    assert data["deleted"] == True


def test_customer_put(client_authed):
    """_summary_
    Test customer post
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
        company (Company): a company object
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cus = CustomerFactory.create(company_id=comp.company_id)
    payload = {
        "customer_name": "updated customer",
        "company_id": comp.company_id,
        "deleted": True
    }

    response = client.put(f"/{END_POINT}/{cus.customer_id}", json=payload)
    print(response.data)
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data["customer_name"] == payload["customer_name"]
    assert data["deleted"] == payload["deleted"]
    assert data["company_id"] == comp.company_id


def test_customer_post_invalid_attributes(client_authed):
    """_summary_
    Test customer post validation with invalid attributes
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
        company (Company): a company object
    """
    # Arrange (Invalid deleted value)
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cus = CustomerFactory.create(company_id=comp.company_id)
    payload = {
        "customer_name": "updated customer",
        "deleted": "never"
    }

    # Act
    response = client.put(f"/{END_POINT}/{cus.customer_id}", json=payload)

    # Assert
    assert response.status_code == 400

    # Arrange (Invalid customer name)
    payload = {
        "customer_name": "a" * 60,
        "deleted": False
    }

    # Act
    res = client.put(f"/{END_POINT}/{cus.customer_id}", json=payload)

    # Assert
    assert res.status_code == 400

    # Arrange (Invalid empty customer name)
    payload = {
        "customer_name": "",
        "deleted": False
    }

    # Act
    res = client.put(f"/{END_POINT}/{cus.customer_id}", json=payload)

    # Assert
    assert res.status_code == 400

    # Arrange (Invalid missing deleted
    payload = {
        "customer_name": "updated customer",
        "deleted": False
    }

    # Act
    res = client.put(f"/{END_POINT}/{cus.customer_id}", json=payload)

    # Assert
    assert res.status_code == 400


def test_customer_put_missing_attributes(client_authed):
    """_summary_
    Test customer put validation with missing attributes
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """

    # Arrange (missing customer name)
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cus = CustomerFactory.create(company_id=comp.company_id)

    payload = {
        "deleted": False,
    }

    # Act
    res = client.put(f"/{END_POINT}/{cus.customer_id}", json=payload)

    # Assert
    assert res.status_code == 400


def test_customer_put_invalid_id(client_authed):
    """_summary_
    Test customer put with invalid id
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cus = CustomerFactory.create(company_id=comp.company_id)
    payload = {
        "customer_name": "updated customer",
        "deleted": False
    }

    # Act
    response = client.put(f"/{END_POINT}/abc", json=payload)

    # Assert
    assert response.status_code == 404


def test_customer_put_missing_id(client_authed):
    """_summary_
    Test customer put with missing id
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cus = CustomerFactory.create(company_id=comp.company_id)
    payload = {
        "customer_name": "updated customer",
        "deleted": False
    }

    # Act
    res = client.put(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 405


def test_customer_put_unauthorized(client, customer):
    """_summary_
    Test customer put with an unauthorized user
    Args:
        client (app): the app client
        customer (Customer): a customer object
    """
    # Arrange
    payload = {
        "customer_name": "updated customer",
        "deleted": False
    }

    # Act
    response = client.put(f"/{END_POINT}/{customer.customer_id}", json=payload)

    # Assert
    assert response.status_code == 401


def test_customer_put_another_users_customer(client_authed, customer):
    """_summary_
    Test customer put with another users customer
    Args:
        client_authed ([client, user]): an array containing the authenticated client and user
        customer (Customer): a customer object
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    cus = CustomerFactory.create(company_id=comp.company_id)
    payload = {
        "customer_name": "updated customer",
        "deleted": False
    }

    # Act
    response = client.put(f"/{END_POINT}/{customer.customer_id}", json=payload)

    # Assert
    assert response.status_code == 400
