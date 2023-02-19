import pytest
import json
from config_test import app, client
END_POINT = "v1/auth"


@pytest.mark.usefixtures("client")
def test_auth_login(client):
    response = client.post("/{}/login".format(END_POINT))

    # convert response to dicitionary
    data = response.data.decode("utf-8")
    data = json.loads(data)

    # assertions
    assert "LOGED_IN" == data["data"]
    assert 200 == response.status_code


@pytest.mark.usefixtures("client")
def test_auth_logout(client):
    response = client.delete("/{}/logout".format(END_POINT))

    # No content. We are deleting users token fron db
    # therefore no content
    assert 204 == response.status_code
