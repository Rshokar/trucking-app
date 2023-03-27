import pytest
import json
from config_test import app, client, session, user, company, customer, dispatch, operator, client_authed
from utils.loader import CompanyFactory, OperatorFactory
END_POINT = "v1/company/operators"


def test_get_operator(client_authed):
    """_summary_
        Get a operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)

    # Act
    res = client.get(f"/{END_POINT}/{oper.operator_id}")
    data = res.json

    # Assert
    assert res.status_code == 200
    assert "operator_id" in data.keys()
    assert "company_id" in data.keys()
    assert "operator_name" in data.keys()
    assert "operator_email" in data.keys()


def test_get_non_existant_user(client_authed):
    """_summary_
        Get a non existant operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)

    # Act
    res = client.get(f"/{END_POINT}/99999")

    # Assert
    assert res.status_code == 404
    data = res.json
    assert "error" in data.keys()


def test_get_operator_unauthorized(client, operator):
    """_summary_
        Get a operator unauthorized
    Args:
        client (app): flask app
    """

    # Arrange

    # Act
    res = client.get(f"/{END_POINT}/{operator.operator_id}")

    # Assert
    assert res.status_code == 401


def test_get_operator_another_user(client_authed, operator):
    """_summary_
        Get a operator unauthorized
    Args:
        client_authed (Array): an array containing the authenticated client and user
        operator (Operator): An Operator Object from DB
    """

    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)

    # Act
    res = client.get(f"/{END_POINT}/{operator.operator_id}")

    # Assert
    assert res.status_code == 404


def test_get_operator_invalid_attributes(client_authed):
    """_summary_
        Get a operator with invalid attributes
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)

    # Act
    res = client.get(f"/{END_POINT}/abc")

    # Assert
    assert res.status_code == 404


def test_create_a_operator(client_authed):
    """_summary_
        Creates a valid Operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """

    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    payload = {
        "company_id": comp.company_id,
        "operator_name": "Keving Gates",
        "operator_email": "gator@gatertown.us"
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 201
    assert "operator_id" in data.keys()
    assert "company_id" in data.keys()
    assert "operator_name" in data.keys()
    assert "operator_email" in data.keys()


def test_create_operator_missing_attribute(client_authed):
    """_summary_
        Try's to create a operator with missing attributes
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange (missing company_id)
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    payloads = [{
        "operator_name": "Keving Gates",
        "operator_email": "gator@gatertown.us"
    }, {
        "company_id": comp.company_id,
        "operator_email": "gator@gatertown.us"
    }, {
        "company_id": comp.company_id,
        "operator_name": "Keving Gates",
    }]
    for payload in payloads:
        # Act
        res = client.post(f"/{END_POINT}/", json=payload)

        # Assert
        assert res.status_code == 400


def test_create_operator_invalid_attributes(client_authed):
    """_summary_
        Trying to create operators with invalid attributes
    Args:
        client (_type_): _description_
        company (_type_): _description_
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)

    payloads = [
        {
            "company_id": "ABC123",
            "operator_name": "Keving Gates",
            "operator_email": "gator@gatertown.us"
        },
        {
            "company_id": comp.company_id,
            "operator_name": "",
            "operator_email": "gator@gatertown.us"
        },
        {
            "company_id": comp.company_id,
            "operator_name": "Keving Gates",
            "operator_email": "gatorgatertown.us"
        },
        {
            "company_id": comp.company_id,
            "operator_name": "Keving Gates",
            "operator_email": "gator@gatertownus"
        },
        {
            "company_id": comp.company_id,
            "operator_name": "Keving Gates",
            "operator_email": "gator@gatertown."
        },
        {
            "company_id": comp.company_id,
            "operator_name": "Keving Gates",
            "operator_email": "@gatertown.us"
        }
    ]

    # Act & Assert
    for payload in payloads:
        res = client.post(f"/{END_POINT}/", json=payload)
        assert res.status_code == 400


def test_create_operator_with_email_already_taken(client_authed):
    """_summary_
        Trie to create an operator with an email already take
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)
    payload = {
        "company_id": comp.company_id,
        "operator_name": "Keving Gates",
        "operator_email": oper.operator_email
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 400
    data = res.json
    assert "error" in data.keys()


def test_create_operator_with_company_id_not_found(client_authed):
    """_summary_
        Try to create an operator with a company_id not found
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    payload = {
        "company_id": 99999,
        "operator_name": "Keving Gates",
        "operator_email": "kevingates@gmail.com",
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    print(res.data)
    assert res.status_code == 404


def test_create_operator_with_unauthed_user(client, company):
    """_summary_
        Try to create an operator with an unauthed user
    Args:
        client (flask app): Flask application
        company (Company): A Company Object from DB
    """
    # Arrange
    payload = {
        "company_id": company.company_id,
        "operator_name": "Keving Gates",
        "operator_email": "anEmail#gmail.com"
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 401


def test_update_operator(client_authed):
    """_summary_
        Update a operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)
    payload = {
        "operator_name": "Kevin Stain",
        "operator_email": "alegator@gatorbay.org"
    }

    # Act
    res = client.put(f"/{END_POINT}/{oper.operator_id}", json=payload)

    # Assert
    assert res.status_code == 200
    data = res.json
    assert "operator_id" in data.keys()
    assert data["operator_id"] == oper.operator_id
    assert data["company_id"] == oper.company_id
    assert data["operator_name"] == payload["operator_name"]
    assert data["operator_email"] == payload["operator_email"]


def test_update_operator_missing_attribute(client_authed):
    """_summary_
        Try to update a operator with missing attributes
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)

    payloads = [{
        "operator_email": "gator@gatertown.us"
    }, {
        "operator_name": "Keving Gates",
    }]
    for payload in payloads:
        res = client.put(f"/{END_POINT}/{oper.operator_id}", json=payload)
        assert res.status_code == 400


def test_update_operator_invalid_attributes(client_authed):
    """_summary_
        Try to update a operator with invalid attributes
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)
    payload = [{
        "operator_name": "",
        "operator_email": "gator@gatertown.us"
    }, {
        "operator_name": "Keving Gates",
        "operator_email": "gatorgatertown.us"
    }, {
        "operator_name": "Keving Gates",
        "operator_email": "gator@gatertownus"
    }, {
        "operator_name": "Keving Gates",
        "operator_email": "gator@gatertown."
    }, {
        "operator_name": "Keving Gates",
        "operator_email": "@gatertown.us"
    }]

    for payload in payload:
        res = client.put(f"/{END_POINT}/{oper.operator_id}", json=payload)

        assert res.status_code == 400


def test_update_non_existant_operator(client_authed):
    """_summary_
        Try to update a non-existant operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    payload = {
        "operator_name": "Kevin Stain",
        "operator_email": "alegator@gatorbay.org"
    }

    res = client.put(f"/{END_POINT}/999999", json=payload)
    data = res.json
    print(data)
    assert res.status_code == 404
    assert "error" in data.keys()


def test_update_operator_with_duplicate_email(client_authed):
    """_summary_
        Try to update a operator with a duplicate email
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    operOne = OperatorFactory.create(company_id=comp.company_id)
    operTwo = OperatorFactory.create(company_id=comp.company_id)
    payload = {
        "operator_name": "Keving Gates",
        "operator_email": operOne.operator_email
    }

    res = client.put(f"/{END_POINT}/{operTwo.operator_id}", json=payload)

    assert res.status_code == 400


def test_update_operator_another_users_operator(client_authed, operator):
    """_summary_
        Try to update a another users operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)

    payload = {
        "operator_name": "Kevin Stain",
        "operator_email": "cheveron@demo.com"
    }

    # Act
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)

    # Assert
    assert res.status_code == 404


def test_update_operator_unauthed(client, operator):
    """_summary_
        Try to update a operator with an unauthed user
    Args:
        client (flask app): Flask application
    """
    # Arrange
    payload = {
        "operator_name": "Kevin Stain",
        "operator_email": "blink182@gmail.com"
    }

    # Act
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)

    # Assert
    assert res.status_code == 401


def test_delete_operator(client_authed, operator):
    """_summary_
        Delete a operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)

    # Act
    res = client.delete(f"/{END_POINT}/{oper.operator_id}")

    # Assert
    assert res.status_code == 200


def test_delete_non_existant_operator(client_authed):
    """_summary_
        Try to delete a non-existant operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    # Act
    res = client.delete(f"/{END_POINT}/9999999")

    # Assert
    assert res.status_code == 404


def test_delete_another_users_operator(client_authed, operator):
    """_summary_
        Try to delete a another users operator
    Args:
        client_authed (Array): an array containing the authenticated client and user
    """
    # Arrange
    client, user = client_authed
    comp = CompanyFactory.create(owner_id=user.id)
    oper = OperatorFactory.create(company_id=comp.company_id)

    # Act
    res = client.delete(f"/{END_POINT}/{operator.operator_id}")

    # Assert
    assert res.status_code == 404


def test_delete_operator_unauthed(client, operator):
    """_summary_
        Try to delete a operator with an unauthed user
    Args:
        client (flask app): Flask application
    """
    # Arrange

    # Act
    res = client.delete(f"/{END_POINT}/{operator.operator_id}")

    # Assert
    assert res.status_code == 401
