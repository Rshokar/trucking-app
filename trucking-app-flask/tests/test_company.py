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
    assert type(data["company_id"]) == int
    assert "owner_id" in data.keys()
    assert type(data["owner_id"]) == int
    assert "company_name" in data.keys()


@pytest.mark.usefixtures("client")
def test_user_put(client):
    headers = {"Content-Type": "application/json"}
    paylod = { "company_name": "AKS Trucking Ltd"}
    response = client.put(
        f"/{END_POINT}/1",
        headers=headers, 
        json=paylod
    )

    # convert response to dicitionary
    data = response.data.decode("utf-8")
    print(f"PREPROCESSED DATA: {data}")
    data = json.loads(data)['data']
    print(f"PROCESSED DATA: {data}")

    # assertions
    assert 200 == response.status_code
    assert "company_id" in data.keys()
    assert type(data["company_id"]) == int
    assert "owner_id" in data.keys()
    assert type(data["owner_id"]) == int
    assert "company_name" in data.keys()
    assert "AKS Trucking Ltd" == data['company_name']

