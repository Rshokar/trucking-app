import pytest
import json
from config_test import app, client
END_POINT = "company"


@pytest.mark.usefixtures("client")
def test_user_get(client):
    """
    Test a valid get request
    """
    response = client.get("/{}/1".format(END_POINT))

    # convert response to dicitionary
    data = response.data.decode("utf-8")
    data = json.loads(data)['data']
    
    # assertions
    assert 200 == response.status_code
    assert "company_id" in data.keys()
    assert type(data["company_id"]) != int
    assert "owner_id" in data.keys()
    assert type(data["owner_id"]) == int
    assert "company_name" in data.keys()

# @pytest.mark.usefixtures("client")
# def test_user_post(client):
#     response = client.post("/{}/".format(END_POINT))

#     # convert response to dicitionary
#     data = response.data.decode("utf-8")
#     data = json.loads(data)

#     # assertions
#     assert "COMPANY_POST" == data["data"]
#     assert 200 == response.status_code


# @pytest.mark.usefixtures("client")
# def test_user_put(client):
#     response = client.put("/{}/".format(END_POINT))

#     # convert response to dicitionary
#     data = response.data.decode("utf-8")
#     data = json.loads(data)

#     # assertions
#     assert "COMPANY_PUT" == data["data"]
#     assert 200 == response.status_code


# @pytest.mark.usefixtures("client")
# def test_user_delete(client):
#     response = client.delete("/{}/".format(END_POINT))

#     # Delete returns a 204 which is no content
#     assert 204 == response.status_code
