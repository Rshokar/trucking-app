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
