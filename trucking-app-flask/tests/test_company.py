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
    assert response.status_code == 401


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

# def test_company_get_invalid_id(client):
#     """_summary_
#         Attempts to make a get request with an invalid parameter
#     Args:
#         client (_type_): _description_
#     """

#     res = client.get(f"/{END_POINT}/invalid")
#     data = res.json

#     assert res.status_code == 404


# def test_company_post(client, user):
#     """_summary_
#         Attempts to create a new company
#     Args:
#         client (_type_): _description_
#     """

#     payload = {
#         "owner_id": user.id,
#         "company_name": "AKS Trucking Ltd"
#     }

#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 200
#     assert "company_id" in data.keys()
#     assert "owner_id" in data.keys()
#     assert data["owner_id"] == payload["owner_id"]
#     assert "company_name" in data.keys()
#     assert data["company_name"] == payload["company_name"]


# def test_company_put(client, company):
#     headers = {"Content-Type": "application/json"}
#     payload = {"company_name": "AKS Trucking Ltd"}
#     response = client.put(
#         f"/{END_POINT}/{company.company_id}",
#         headers=headers,
#         json=payload
#     )

#     data = json.loads(response.data)

#     assert response.status_code == 200
#     assert "company_id" in data.keys()
#     assert type(data["company_id"]) == int
#     assert "owner_id" in data.keys()
#     assert type(data["owner_id"]) == int
#     assert "company_name" in data.keys()
#     assert payload["company_name"] == data["company_name"]


# def test_company_put_nonexistent(client):
#     headers = {"Content-Type": "application/json"}
#     payload = {"company_name": "AKS Trucking Ltd"}
#     response = client.put(
#         f"/{END_POINT}/1000",
#         headers=headers,
#         json=payload
#     )
#     data = json.loads(response.data)

#     assert response.status_code == 404
#     assert "error" in data.keys()
#     assert data["error"] == "Company not found."


# def test_company_delete(client, company):
#     response = client.delete(f"/{END_POINT}/{company.company_id}")
#     assert response.status_code == 204


# def test_company_delete_nonexistent(client):
#     response = client.delete(f"/{END_POINT}/1000")

#     data = json.loads(response.data)

#     assert response.status_code == 404
#     assert "error" in data.keys()
#     assert data["error"] == "Company not found."
