import pytest
import json
from config_test import app, client, billing_ticket, rfo
END_POINT = "v1/billing_ticket"


def test_billing_ticket_get(client, billing_ticket):
    """_summary_
        Test geting a billing ticket
    Args:
        client (_type_): _description_
        billing_ticket (_type_): _description_
    """
    res = client.get(f"/{END_POINT}/{billing_ticket.bill_id}")
    data = res.json

    assert res.status_code == 200
    assert "bill_id" in data.keys()
    assert data["bill_id"] == billing_ticket.bill_id
    assert "rfo_id" in data.keys()
    assert data["rfo_id"] == billing_ticket.rfo_id
    assert "ticket_number" in data.keys()
    assert data["ticket_number"] == billing_ticket.ticket_number


def test_billing_ticket_get_non_existant(client):
    """_summary_
        Test geting a billing ticket that does not exist
    Args:
        client (_type_): _description_
    """
    res = client.get(f"/{END_POINT}/{123456789}")
    data = res.json

    assert res.status_code == 404
    assert "error" in data.keys()


def test_billing_ticket_get_invalid(client):
    """_summary_
        Test geting a billing ticket with invalid id
    Args:
        client (_type_): _description_
    """

    res = client.get(f"/{END_POINT}/{'invalid'}")
    data = res.json

    assert res.status_code == 404


def test_billing_ticket_post(client, rfo):
    """_summary_
        Test creating a billing ticket
    Args:
        client (_type_): _description_
    """

    payload = {
        "rfo_id": rfo.rfo_id,
        "ticket_number": 123456789,
        "image_id": 123456789
    }
    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json
    print(data)

    assert res.status_code == 201
    assert "bill_id" in data.keys()
    assert "rfo_id" in data.keys()
    assert data["rfo_id"] == payload["rfo_id"]
    assert "ticket_number" in data.keys()
    assert data["ticket_number"] == payload["ticket_number"]
    assert "image_id" in data.keys()
    assert data["image_id"] == payload["image_id"]


def test_billing_ticket_post_non_existant_rfo(client):
    """_summary_
        Test creating a billing ticket with non existant rfo
    Args:
        client (_type_): _description_
    """

    payload = {
        "rfo_id": 123456789,
        "ticket_number": 123456789,
        "image_id": 123456789
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 404
    assert "error" in data.keys()


def test_billing_ticket_post_missing_attributes(client, rfo):
    """_summary_
        Test creating a billing ticket with missing attributes
    Args:
        client (_type_): _description_
    """

    payload = {
        "ticket_number": 123456789,
        "image_id": 123456789
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    payload = {
        "rfo_id": rfo.rfo_id,
        "image_id": 123456789
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    payload = {
        "rfp_id": rfo.rfo_id,
        "ticket_number": 123456789
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()


def test_billing_ticket_post_invalid_attributes(client, rfo):
    """_summary_
        Test creating a billing ticket with invalid attributes
    Args:
        client (_type_): _description_
    """
    # Invalid rfo_id
    payload = {
        "rfo_id": "invalid",
        "ticket_number": 123456789,
        "image_id": 123456789
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid ticket_number
    payload = {
        "rfo_id": rfo.rfo_id,
        "ticket_number": "invalid",
        "image_id": 123456789
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid image_id
    payload = {
        "rfo_id": rfo.rfo_id,
        "ticket_number": 123456789,
        "image_id": "invalid"
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()


def test_billing_ticket_delete(client, billing_ticket):
    """_summary_
        Test deleting a billing ticket
    Args:
        client (_type_): _description_
        billing_ticket (_type_): _description_
    """

    res = client.delete(f"/{END_POINT}/{billing_ticket.bill_id}")
    data = res.json

    assert res.status_code == 200
    assert "message" in data.keys()


def test_billing_ticket_delete_non_existant(client):
    """_summary_
        Test deleting a billing ticket that does not exist
    Args:
        client (_type_): _description_
    """

    res = client.delete(f"/{END_POINT}/{123456789}")
    data = res.json

    assert res.status_code == 404
    assert "error" in data.keys()
