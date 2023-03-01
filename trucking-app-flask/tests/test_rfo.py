import pytest
import json
from datetime import datetime
from config_test import app, client, session, user, company, customer, dispatch, operator, operator_dispatch, rfo
END_POINT = "v1/rfo"


def test_rfo_post(client, operator_dispatch):
    dispatch = operator_dispatch[1]
    operator = operator_dispatch[0]

    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }
    res = client.post(f"/{END_POINT}/", json=payload)

    # convert response to dicitionary
    data = res.json
    print(f"DATA: {data}")

    # assertions
    assert res.status_code == 201
    assert "trailer" in data.keys()
    assert data["trailer"] == payload["trailer"]
    assert "truck" in data.keys()
    assert data["truck"] == payload["truck"]
    assert "start_location" in data.keys()
    assert data["start_location"] == payload["start_location"]
    assert "start_time" in data.keys()
    assert datetime.strptime(data["start_time"], '%a, %d %b %Y %H:%M:%S %Z') == datetime.strptime(
        payload["start_time"], "%Y-%m-%d %H:%M:%S")
    assert "dump_location" in data.keys()
    assert data["dump_location"] == payload["dump_location"]
    assert "dispatch_id" in data.keys()
    assert data["dispatch_id"] == payload["dispatch_id"]
    assert "operator_id" in data.keys()
    assert data["operator_id"] == payload["operator_id"]
    assert "load_location" in data.keys()
    assert data["load_location"] == payload["load_location"]


def test_rfo_post_missing_attributes(client, operator_dispatch):
    dispatch = operator_dispatch[1]
    operator = operator_dispatch[0]

    # Missing dispatch_id
    payload = {
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Missing operator_id
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Missing trailer
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Missing truck
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Missing start_location
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Missing start_time
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Missing dump_location
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Missing load_location
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()


def test_rfo_post_invalid_attributes(client, operator_dispatch):
    dispatch = operator_dispatch[1]
    operator = operator_dispatch[0]

    # Invalid dispatch_id
    payload = {
        "dispatch_id": "ABC",
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid operator_id
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": "ABC",
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid start_location
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "truck": "truck",
        "trailer": "trailer",
        "start_location": "",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid start_time
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid Start Time
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid Start Time
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_time": "2022-02-0202:02:02",
        "start_location": "start_location",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid dump_location
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "dump_location": "",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "load_location": "load_location",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()

    # Invalid load_location
    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "",
    }

    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()


def test_rfo_get(client, rfo):
    res = client.get(f"/{END_POINT}/{rfo.rfo_id}")
    data = res.json

    assert res.status_code == 200
    assert data["rfo_id"] == rfo.rfo_id


def test_non_existing_rfo_get(client):
    res = client.get(f"/{END_POINT}/999999")
    data = res.json

    assert res.status_code == 404
    assert "error" in data.keys()
