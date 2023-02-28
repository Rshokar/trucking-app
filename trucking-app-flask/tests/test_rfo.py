import pytest
import json
from datetime import datetime
from config_test import app, client, session, user, company, customer, dispatch, operator, operator_dispatch
END_POINT = "v1/rfo"


@pytest.mark.usefixtures("client")
def test_user_post(client, operator_dispatch):
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
