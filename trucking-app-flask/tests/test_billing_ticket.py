import pytest
import json
from config_test import app, user, client, billing_ticket, rfo, billing_ticket_authed, rfo_authed, operator_authed, dispatch_authed, company_authed, client_authed, operator_dispatch_authed
END_POINT = "v1/billing_ticket"


def test_get_bill_valid_id_current_user(billing_ticket_authed):

    # Arrange
    client, bill, user, oper, disp, comp, cus, rfo = billing_ticket_authed
    # Get the billing ticket with the valid ID and current user's ID
    response = client.get(
        f"/{END_POINT}/{bill.bill_id}")

    # Check that the response code is 200
    assert response.status_code == 200

    # Check that the response body contains the correct details for the billing ticket
    assert json.loads(response.data) == {
        "bill_id": bill.bill_id,
        "rfo_id": bill.rfo_id,
        "ticket_number": bill.ticket_number,
        "image_id": bill.image_id
    }


def test_get_bill_valid_id_not_current_user(billing_ticket_authed, billing_ticket):
    # Arrange
    client, bill, user, oper, disp, comp, cus, rfo = billing_ticket_authed

    # Get the billing ticket with the valid ID but a different owner than the current user
    response = client.get(
        f"/{END_POINT}/{billing_ticket.bill_id}")

    # Check that the response code is 404
    assert response.status_code == 404

    # Check that the response body contains the correct error message
    assert json.loads(response.data) == {"error": "Billing ticket not found"}


def test_get_bill_valid_id_not_in_database(billing_ticket_authed):

    # Arrange
    client, bill, user, oper, disp, comp, cus, rfo = billing_ticket_authed

    # Get the billing ticket with a valid ID that does not exist in the database
    response = client.get(f"/{END_POINT}/9999")

    # Check that the response code is 404
    assert response.status_code == 404

    # Check that the response body contains the correct error message
    assert json.loads(response.data) == {"error": "Billing ticket not found"}


def test_get_bill_unauthed(client):
    # Arrange
    # Get the billing ticket with an unauthenticated user

    response = client.get(f"/{END_POINT}/1")

    # Check that the response code is 401
    assert response.status_code == 401


def test_get_bill_invalid_id(client_authed):
    # Arrange
    client, user = client_authed

    # Act
    res = client.get(f'/{END_POINT}/invalid_id')

    # Assert
    assert res.status_code == 404


def test_get_bill_invalid_id_zero(client_authed):
    # Arrange
    client, user = client_authed

    # Act
    res = client.get(f'/{END_POINT}/0')

    # Assert
    assert res.status_code == 404


def test_get_bill_no_id(client_authed):
    # Arrange
    client, user = client_authed

    # Act
    res = client.get(f'/{END_POINT}/')

    # Assert
    assert res.status_code == 405


def test_get_bill_sql_injection(client_authed):
    # Arrange
    client, user = client_authed

    # Act
    res = client.get(f"/{END_POINT}/1'; DROP TABLE billing_tickets;")

    # Assert
    assert res.status_code == 404


def test_create_bill_with_valid_inputs(rfo_authed):
    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed
    data = {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "1234",
        "image_id": "a9df89f"
    }

    # Act
    response = client.post(f"/{END_POINT}/", json=data)

    # Assert
    print(response.data)
    assert response.status_code == 201
    assert response.json["rfo_id"] == data["rfo_id"]
    assert response.json["ticket_number"] == int(data["ticket_number"])
    assert response.json["image_id"] == data["image_id"]


def test_create_bill_with_valid_rfo_id_not_owned_by_user(rfo_authed, rfo):
    # Arrange
    client, requestforOperator, user, oper, disp, comp, cus = rfo_authed

    rfo, user, customer, company, dispatch, operator = rfo
    data = {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "1234",
        "image_id": "a9df89f"
    }

    # Act
    response = client.post(f"/{END_POINT}/", json=data)
    print(response.data)

    # Assert
    assert response.status_code == 404


def test_create_bill_with_invalid_inputs(rfo_authed):
    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed
    payloads = [{
        "rfo_id": 0,
        "ticket_number": "1234",
        "image_id": "1"
    }, {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "1",
        "image_id": "1" * 25
    }, {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "1" * 60,
        "image_id": "1" * 25
    }, {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "1234",
        "image_id": "1"
    }, {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "1234",
        "image_id": "1" * 60
    }]

    for payload in payloads:
        # Act
        response = client.post(f"/{END_POINT}/", data=payload)

        # Assert
        assert response.status_code == 400


def test_create_bill_without_required_fields(rfo_authed):
    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed
    payloads = [{
        "ticket_number": "1234",
        "image_id": "1"
    }, {
        "rfo_id": rfo.rfo_id,
        "image_id": "1" * 25
    }, {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "1" * 60,
    }]

    for payload in payloads:
        # Act
        response = client.post(f"/{END_POINT}/", data=payload)

        # Assert
        assert response.status_code == 400


def test_create_bill_with_sql_injection(client_authed):
    # Arrange
    client, user = client_authed
    payloads = [{
        "rfo_id": "1; DROP TABLE users",
        "ticket_number": "1234",
        "image_id": 1
    }, {
        "rfo_id": "1",
        "ticket_number": "1234  DROP TABLE users",
        "image_id": 1
    }]

    for payload in payloads:
        # Act
        response = client.post(f"/{END_POINT}/", json=payload)

        # Assert
        assert response.status_code == 400


def test_create_bill_unauthed(client, rfo):
    # Arrange
    rfo = rfo[0]
    data = {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "1234",
        "image_id": "a9df89f"
    }

    # Act
    response = client.post(f"/{END_POINT}/", json=data)

    # Assert
    assert response.status_code == 401

# def test_billing_ticket_get(client, billing_ticket):
#     """_summary_
#         Test geting a billing ticket
#     Args:
#         client (_type_): _description_
#         billing_ticket (_type_): _description_
#     """
#     res = client.get(f"/{END_POINT}/{billing_ticket.bill_id}")
#     data = res.json

#     assert res.status_code == 200
#     assert "bill_id" in data.keys()
#     assert data["bill_id"] == billing_ticket.bill_id
#     assert "rfo_id" in data.keys()
#     assert data["rfo_id"] == billing_ticket.rfo_id
#     assert "ticket_number" in data.keys()
#     assert data["ticket_number"] == billing_ticket.ticket_number


# def test_billing_ticket_get_non_existant(client):
#     """_summary_
#         Test geting a billing ticket that does not exist
#     Args:
#         client (_type_): _description_
#     """
#     res = client.get(f"/{END_POINT}/{123456789}")
#     data = res.json

#     assert res.status_code == 404
#     assert "error" in data.keys()


# def test_billing_ticket_get_invalid(client):
#     """_summary_
#         Test geting a billing ticket with invalid id
#     Args:
#         client (_type_): _description_
#     """

#     res = client.get(f"/{END_POINT}/{'invalid'}")
#     data = res.json

#     assert res.status_code == 404


# def test_billing_ticket_post(client, rfo):
#     """_summary_
#         Test creating a billing ticket
#     Args:
#         client (_type_): _description_
#     """

#     payload = {
#         "rfo_id": rfo.rfo_id,
#         "ticket_number": 123456789,
#         "image_id": 123456789
#     }
#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json
#     print(data)

#     assert res.status_code == 201
#     assert "bill_id" in data.keys()
#     assert "rfo_id" in data.keys()
#     assert data["rfo_id"] == payload["rfo_id"]
#     assert "ticket_number" in data.keys()
#     assert data["ticket_number"] == payload["ticket_number"]
#     assert "image_id" in data.keys()
#     assert data["image_id"] == payload["image_id"]


# def test_billing_ticket_post_non_existant_rfo(client):
#     """_summary_
#         Test creating a billing ticket with non existant rfo
#     Args:
#         client (_type_): _description_
#     """

#     payload = {
#         "rfo_id": 123456789,
#         "ticket_number": 123456789,
#         "image_id": 123456789
#     }

#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 404
#     assert "error" in data.keys()


# def test_billing_ticket_post_missing_attributes(client, rfo):
#     """_summary_
#         Test creating a billing ticket with missing attributes
#     Args:
#         client (_type_): _description_
#     """

#     payload = {
#         "ticket_number": 123456789,
#         "image_id": 123456789
#     }

#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()

#     payload = {
#         "rfo_id": rfo.rfo_id,
#         "image_id": 123456789
#     }

#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()

#     payload = {
#         "rfp_id": rfo.rfo_id,
#         "ticket_number": 123456789
#     }

#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()


# def test_billing_ticket_post_invalid_attributes(client, rfo):
#     """_summary_
#         Test creating a billing ticket with invalid attributes
#     Args:
#         client (_type_): _description_
#     """
#     # Invalid rfo_id
#     payload = {
#         "rfo_id": "invalid",
#         "ticket_number": 123456789,
#         "image_id": 123456789
#     }

#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()

#     # Invalid ticket_number
#     payload = {
#         "rfo_id": rfo.rfo_id,
#         "ticket_number": "invalid",
#         "image_id": 123456789
#     }

#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()

#     # Invalid image_id
#     payload = {
#         "rfo_id": rfo.rfo_id,
#         "ticket_number": 123456789,
#         "image_id": "invalid"
#     }

#     res = client.post(f"/{END_POINT}/", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()


# def test_billing_ticket_put(client, billing_ticket):
#     """_summary_
#         Test updating a billing ticket
#     Args:
#         client (_type_): _description_
#         billing_ticket (_type_): _description_
#     """

#     payload = {
#         "ticket_number": 123456789,
#         "image_id": 123456789
#     }

#     res = client.put(f"/{END_POINT}/{billing_ticket.bill_id}", json=payload)
#     data = res.json

#     assert res.status_code == 200
#     assert "bill_id" in data.keys()
#     assert data["bill_id"] == billing_ticket.bill_id
#     assert "rfo_id" in data.keys()
#     assert data["rfo_id"] == billing_ticket.rfo_id
#     assert "ticket_number" in data.keys()
#     assert data["ticket_number"] == payload["ticket_number"]
#     assert "image_id" in data.keys()
#     assert data["image_id"] == payload["image_id"]


# def test_billing_ticket_put_non_existant(client):
#     """_summary_
#         Test updating a billing ticket that does not exist
#     Args:
#         client (_type_): _description_
#     """

#     payload = {
#         "ticket_number": 123456789,
#         "image_id": 123456789
#     }

#     res = client.put(f"/{END_POINT}/{123456789}", json=payload)
#     data = res.json

#     assert res.status_code == 404
#     assert "error" in data.keys()


# def test_billing_ticket_put_invalid_attributes(client, billing_ticket):
#     """_summary_
#         Test updating a billing ticket with invalid attributes
#     Args:
#         client (_type_): _description_
#         billing_ticket (_type_): _description_
#     """

#     # Invalid ticket_number
#     payload = {
#         "ticket_number": "invalid",
#         "image_id": 123456789
#     }

#     res = client.put(f"/{END_POINT}/{billing_ticket.bill_id}", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()

#     # Invalid image_id
#     payload = {
#         "ticket_number": 123456789,
#         "image_id": "invalid"
#     }

#     res = client.put(f"/{END_POINT}/{billing_ticket.bill_id}", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()


# def test_billing_ticket_put_missing_attributes(client, billing_ticket):
#     """_summary_
#         Test updating a billing ticket with missing attributes

#     Args:
#         client (_type_): _description_
#         billing_ticket (_type_): _description_
#     """

#     payload = {
#         "ticket_number": 123456789,
#     }

#     res = client.put(f"/{END_POINT}/{billing_ticket.bill_id}", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()

#     payload = {
#         "image_id": 123456789,
#     }

#     res = client.put(f"/{END_POINT}/{billing_ticket.bill_id}", json=payload)
#     data = res.json

#     assert res.status_code == 400
#     assert "error" in data.keys()


# def test_billing_ticket_delete(client, billing_ticket):
#     """_summary_
#         Test deleting a billing ticket
#     Args:
#         client (_type_): _description_
#         billing_ticket (_type_): _description_
#     """

#     res = client.delete(f"/{END_POINT}/{billing_ticket.bill_id}")
#     data = res.json

#     assert res.status_code == 200
#     assert "message" in data.keys()


# def test_billing_ticket_delete_non_existant(client):
#     """_summary_
#         Test deleting a billing ticket that does not exist
#     Args:
#         client (_type_): _description_
#     """

#     res = client.delete(f"/{END_POINT}/{123456789}")
#     data = res.json

#     assert res.status_code == 404
#     assert "error" in data.keys()
