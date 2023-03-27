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


# def test_update_a_operator(client, operator):
#     """_summary_
#         Updates an operator
#     Args:
#         client (_type_): _description_
#         company {Company}: A Company Object from DB
#     """

#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "Kevin Stain",
#         "operator_email": "alegator@gatorbay.org"
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     data = res.json

#     print(f"DATA: {data}")

#     print(data)
#     assert res.status_code == 200
#     assert "operator_id" in data.keys()
#     assert data["operator_id"] == operator.operator_id
#     assert data["company_id"] == operator.company_id
#     assert data["operator_name"] == payload["operator_name"]
#     assert data["operator_email"] == payload["operator_email"]


# def test_update_operator_missing_attribute(client, operator):
#     """_summary_
#         Try's to update a operator with missing attributes
#     Args:
#         client (_type_): _description_
#         company {Company}: A Company Object from DB
#     """

#     payload = {
#         "operator_name": "Keving Gates",
#         "operator_email": "gator@gatertown.us"
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400

#     payload = {
#         "company_id": operator.company_id,
#         "operator_email": "gator@gatertown.us"
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400

#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "Keving Gates",
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400


# def test_update_operator_invalid_attributes(client, operator):
#     """_summary_
#         Trying to update operators with invalid attributes
#     Args:
#         client (_type_): _description_
#         company (_type_): _description_
#     """
#     payload = {
#         "company_id": "ABC123",
#         "operator_name": "Keving Gates",
#         "operator_email": "gator@gatertown.us"
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400

#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "",
#         "operator_email": "gator@gatertown.us"
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400

#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "Keving Gates",
#         "operator_email": "gatorgatertown.us"
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400

#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "Keving Gates",
#         "operator_email": "gator@gatertownus"
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400

#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "Keving Gates",
#         "operator_email": "gator@gatertown."
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400

#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "Keving Gates",
#         "operator_email": "@gatertown.us"
#     }

#     res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
#     assert res.status_code == 400


# def test_update_non_existant_operator(client, company):
#     """_summary_
#         Testing to see if you can update a non existant operators
#     Args:
#         client (_type_): _description_
#     """

#     payload = {
#         "company_id": company.company_id,
#         "operator_name": "Kevin Stain",
#         "operator_email": "alegator@gatorbay.org"
#     }

#     res = client.put(f"/{END_POINT}/999999", json=payload)
#     data = res.json

#     assert res.status_code == 404
#     assert "error" in data.keys()


# def test_update_a_operator_with_duplicate_email(client, operator):
#     """_summary_
#         Try to update an operator with a duplicate email
#     Args:
#         client (_type_): _description_
#         operator (_type_): _description_
#     """
#     # Create operator
#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "Keving Gates",
#         "operator_email": "test@test.us"
#     }

#     print(operator)
#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 201

#     payload = {
#         "company_id": operator.company_id,
#         "operator_name": "Keving Gates",
#         "operator_email": operator.operator_email
#     }

#     operator_id = data["operator_id"]
#     res = client.put(f"/{END_POINT}/{operator_id}", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()


# def test_delete_an_operator(client, operator):
#     """_summary_
#         Try to delete an valid operator
#     Args:
#         client (): _description_
#         operator (Operator): Operator Object
#     """

#     res = client.delete(
#         f"/{END_POINT}/{operator.company_id}/{operator.operator_id}")
#     data = res.json

#     assert res.status_code == 200
#     assert "message" in data.keys()


# def test_delete_an_non_existant_operator(client, company):
#     """_summary_
#         Try to delete non existant operator
#     Args:
#         client (app): _description_
#         operator (Operator): Operator Object
#     """

#     res = client.delete(f"/{END_POINT}/{company.company_id}/999999")
#     data = res.json

#     assert res.status_code == 404
#     assert "error" in data.keys()


# def test_delete_an_operator_with_non_existant_company(client, operator):
#     """_summary_
#         Try to delete an operator from a company that does not own it.
#     Args:
#         client (app): _description_
#         operator (Operator): Operator Object
#     """

#     res = client.delete(f"/{END_POINT}/9999999/{operator.operator_id}")
#     data = res.json

#     print(data)

#     assert res.status_code == 404
#     assert "error" in data.keys()
