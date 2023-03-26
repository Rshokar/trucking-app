import pytest
import json
from config_test import client_authed, client, app, user, company
from models import Company, User
from utils.loader import UserFactory, CompanyFactory
END_POINT = "v1/company"


def test_company_get(client_authed):
    """_summary_

    Get a company by id
    Args:
        client (_type_): _description_
        company (_type_): _description_
    """
    # Arrange
    client, user = client_authed
    company = CompanyFactory.create(owner_id=user.id)

    # Act
    response = client.get(f"/{END_POINT}/{company.company_id}")

    # Assert
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "company_id" in data.keys()
    assert type(data["company_id"]) == int
    assert "owner_id" in data.keys()
    assert type(data["owner_id"]) == int
    assert "company_name" in data.keys()


def test_company_get_nonexistent(client_authed):
    """_summary_
        Attempts to get a company that does not exist
    Args:
        client_authed (_type_): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    company = CompanyFactory.create(owner_id=user.id)

    # Act
    response = client.get(f"/{END_POINT}/1000")

    # Assert
    assert response.status_code == 404


def test_company_get_another_users_company(client_authed, company):
    """_summary_
        Attempts to get a company that refrences another user
    Args:
        client_authed (Array): an array containing the authenticated client and user
        company (Company): another users company
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    # Act
    response = client.get(f"/{END_POINT}/{company.company_id}")

    # Assert
    assert response.status_code == 403


def test_company_get_non_company_found(client_authed):
    """_summary_
        Attempts to get a company that does not exist
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed

    # Act
    res = client.get(f"/{END_POINT}/1000")

    # Assert
    assert res.status_code == 404


def test_company_get_unauthorized_user(client, company):
    """_summary_
        Attempts to get a company when un authorized
    Args:
        client (Flask App): the flask app
    """
    # Arrange

    # Act
    res = client.get(f"/{END_POINT}/{company.company_id}")

    # Assert
    assert res.status_code == 401


def test_company_get_invalid_id(client_authed):
    """_summary_
        Attempts to make a get request with an invalid parameter
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    company = CompanyFactory.create(owner_id=user.id)

    # Act
    res = client.get(f"/{END_POINT}/invalid")

    # Assert
    assert res.status_code == 404


def test_company_post(client_authed):
    """_summary_
        Attempts to create a company
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    client, user = client_authed
    payload = {
        "owner_id": user.id,
        "company_name": "AKS Trucking Ltd"
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 200
    assert "company_id" in data.keys()
    assert "owner_id" in data.keys()
    assert data["owner_id"] == payload["owner_id"]
    assert "company_name" in data.keys()
    assert data["company_name"] == payload["company_name"]


def test_company_post_invalid_attributes(client_authed):
    """_summary_
        Attempts to create a company with invalid arguments
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange (company_name is empty)
    client, user = client_authed
    payload = {
        "owner_id": user.id,
        "company_name": ""
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400

    # Arrange (owner_id is empty)
    payload = {
        "company_name": "AKS Trucking Ltd",
        "owner_id": ""
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400

    # Arrange (owner_id is invalid)
    payload = {
        "company_name": "AKS Trucking Ltd",
        "owner_id": "invalid"
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400


def test_company_post_missing_attributes(client_authed):
    """_summary_
        Attempts to create a company with missing arguments
    Args:
        client_authed (_type_): _description_
    """
    # Arrange (missing company_name)
    client, user = client_authed
    payload = {
        "owner_id": user.id
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400

    # Arrange (missing owner_id)

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400


def test_company_post_already_have_company(client_authed):
    """_summary_
        Attempts to create a company when the user already has a company
    Args:
        client_authed (_type_): _description_
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    payload = {
        "owner_id": user.id,
        "company_name": "AKS Trucking Ltd"
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 409


def test_company_post_unauthorized_user(client):
    """_summary_
        Attempts to create a company when un authorized
    Args:
        client (Flask App): the flask app
    """
    # Arrange
    payload = {
        "owner_id": 1,
        "company_name": "AKS Trucking Ltd"
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 401


def test_company_put(client_authed):
    """_summary_
        Attempts to update a company
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    payload = {
        "company_name": "AKS Trucking Ltd"
    }

    # Act
    res = client.put(f"/{END_POINT}/{comp.company_id}", json=payload)

    # Assert
    assert res.status_code == 200


def test_company_put_invalid_attributes(client_authed):
    """_summary_
        Attempts to update a company with invalid attributes

    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange (Empty company_name)
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    payload = {
        "company_name": ""
    }

    # Act
    res = client.put(f"/{END_POINT}/{comp.company_id}", json=payload)

    # Assert
    assert res.status_code == 400

    # Arrange (Company name too long)
    payload = {
        "company_name": "a" * 51
    }

    # Act
    res = client.put(f"/{END_POINT}/{comp.company_id}", json=payload)

    # Assert
    assert res.status_code == 400


def test_company_put_missing_attributes(client_authed):
    """_summary_
        Attempts to update a company with missing attributes
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    payload = {}

    # Act
    res = client.put(f"/{END_POINT}/{comp.company_id}", json=payload)

    # Assert
    assert res.status_code == 400


def test_company_put_nonexistent(client_authed):
    """_summary_
        Attempts to update a company that does not exist

    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange
    client, user = client_authed
    payload = {
        "company_name": "AKS Trucking Ltd"
    }

    # Act
    res = client.put(f"/{END_POINT}/1000", json=payload)

    # Assert
    assert res.status_code == 404


def test_company_put_unauthorized_user(client, company):
    """_summary_
        Attempts to update a company when un authorized
    Args:
        client (Flask App): the flask app
    """
    # Arrange
    payload = {
        "company_name": "AKS Trucking Ltd"
    }

    # Act
    res = client.put(f"/{END_POINT}/{company.company_id}", json=payload)

    # Assert
    assert res.status_code == 401


def test_company_put_another_user_company(client_authed, company):
    """_summary_
        Attempts to update a company that does not belong to the user
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange
    client, user = client_authed
    CompanyFactory.create(owner_id=user.id)
    payload = {"company_name": "AKS Trucking Ltd"}

    # Act
    res = client.put(f"/{END_POINT}/{company.company_id}", json=payload)

    # Assert
    assert res.status_code == 403


def test_company_delete(client_authed):
    """_summary_
        Attempts to delete a company
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    # Act
    res = client.delete(f"/{END_POINT}/{comp.company_id}")

    # Assert
    assert res.status_code == 200


def test_company_delete_invalid_attributes(client_authed):
    """_summary_
        Attempts to delete a company with invalid attributes
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    # Act
    res = client.delete(f"/{END_POINT}/a")

    # Assert
    assert res.status_code == 404


def test_company_delete_missing_attributes(client_authed):
    """_summary_
        Attempts to delete a company with missing attributes
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    # Act
    res = client.delete(f"/{END_POINT}/")

    # Assert
    assert res.status_code == 405


def test_company_delete_unauthorized_user(client, company):
    """_summary_
        Attempts to delete a company when un authorized
    Args:
        client (Flask App): the flask app
    """
    # Arrange

    # Act
    res = client.delete(f"/{END_POINT}/{company.company_id}")

    # Assert
    assert res.status_code == 401


def test_company_delete_another_user_company(client_authed, company):
    """_summary_
        Attempts to delete a company that does not belong to the user
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange
    client, user = client_authed
    CompanyFactory.create(owner_id=user.id)

    # Act
    res = client.delete(f"/{END_POINT}/{company.company_id}")

    # Assert
    assert res.status_code == 403
