import pytest
import json
from config_test import app, client
END_POINT = "v1/dispatch"


@pytest.mark.usefixtures("client")
def test_user_get(client):
    response = client.get("/{}/".format(END_POINT))

    # convert response to dicitionary
    data = response.data.decode("utf-8")
    data = json.loads(data)

    # assertions
    assert "DISPATCH_GET" == data["data"]
    assert 200 == response.status_code


@pytest.mark.usefixtures("client")
def test_user_post(client):
    response = client.post("/{}/".format(END_POINT))

    # convert response to dicitionary
    data = response.data.decode("utf-8")
    data = json.loads(data)

    # assertions
    assert "DISPATCH_POST" == data["data"]
    assert 200 == response.status_code


@pytest.mark.usefixtures("client")
def test_user_put(client):
    response = client.put("/{}/".format(END_POINT))

    # convert response to dicitionary
    data = response.data.decode("utf-8")
    data = json.loads(data)

    # assertions
    assert "DISPATCH_PUT" == data["data"]
    assert 200 == response.status_code


@pytest.mark.usefixtures("client")
def test_user_delete(client):
    response = client.delete("/{}/".format(END_POINT))

    # Delete returns a 204 which is no content
    assert 204 == response.status_code
