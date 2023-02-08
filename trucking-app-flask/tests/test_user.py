import pytest
import json
from config_test import app, client
import os
END_POINT = "user"

# Get test data
with open('./data/user_test.json') as json_file:
    test_data = json.load(json_file)



@pytest.mark.usefixtures("client")
def test_user_get(client):
    """
    See if we can successfully perform GET requests on existing users and return their information
    """
    response = client.get("/{}/1".format(END_POINT))

    # convert response to dictionary
    data = response.data.decode("utf-8")
    print("RETURNED DATA: " + data)
    data = json.loads(data)['data']

    # assertions
    assert 200 == response.status_code
    assert "id" in data.keys()
    assert type(data["id"]) == int
    assert "type" in data.keys()
    assert "email" in data.keys()

def test_user_get_nonexistant_user(client):
    """
    Verify that we can perform GET requests with user IDs that don't exist in DB without crashing the app or returning valid users
    """
    response = client.get("/{}/1000".format(END_POINT))

    # convert response to dictionary
    data = response.data.decode("utf-8")

    # assertions
    assert 404 == response.status_code
    assert data == "No user found"

def test_user_invalid_id_format(client):
    """
    Verify that passing an invalid ID format will not work
    """
    response = client.get("/{}/ABCD".format(END_POINT))

    # assertions. Not found
    assert 404 == response.status_code



@pytest.mark.usefixtures("client")
def test_user_post(client):
    """
        Create a valid user
    """
    headers = {"Content-Type": "application/json"}
    payload = test_data['User']
    response = client.post(
        "/{}/".format(END_POINT),
        headers=headers,
        json=payload
    )

    # convert response to dictionary
    data = response.data.decode("utf-8")
    data = json.loads(data)['data']
    # assertions
    assert 200 == response.status_code
    assert payload['type'] == data["type"]
    assert payload['email'] == data["email"]


@pytest.mark.usefixtures("client")
def test_user_post_invalid_data(client):
    """
    See if errors are returned for invalid user data
    """

    headers = {"Content-Type": "application/json"}
    for user in test_data['InValidUsers']:
        payload = {
            "type": user['type'],
            "password": user['password'],
            "email": user['email'],
        }
        response = client.post(
            "/{}/".format(END_POINT),
            headers=headers,
            json=payload
        )

        # convert response to dictionary
        data = response.data.decode("utf-8")

        # assertions
        assert 400 == response.status_code
        assert user['error'] == data


@pytest.mark.usefixtures("client")
def test_user_post_duplicate(client):
    """
        Checks to see if an error is returned when creating a 
        duplicate user
    """

    # Create user
    headers = {"Content-Type": "application/json"}
    payload = test_data['DuplicateUser']
    response = client.post(
        "/{}/".format(END_POINT),
        headers=headers,
        json=payload
    )

    # convert response to dictionary
    data = response.data.decode("utf-8")
    data = json.loads(data)['data']

    # assertions
    assert payload['type'] == data["type"]
    assert payload['email'] == data["email"]
    assert 200 == response.status_code

    # Create dupliate user
    response = client.post(
        "/{}/".format(END_POINT),
        headers=headers,
        json=payload
    )

    data = response.data.decode("utf-8")

    # assertions
    assert 409 == response.status_code
    assert data == "Email already used"


@pytest.mark.usefixtures("client")
def test_user_put(client):
    payload = test_data['UpdateUser']
    headers = {"Content-Type": "application/json"}
    response = client.put(
        "/{}/1".format(END_POINT),
        headers=headers, 
        json=payload
        )

    # convert response to dicitionary
    data = response.data.decode("utf-8")
    print(f"DATA: {data}")
    data = json.loads(data)['data']

    # assertions
    assert 200 == response.status_code
    assert "email" in data.keys()
    assert payload["email"] == data["email"]
    assert "type" in data.keys()
    assert payload["type"] == data["type"]
    assert "id" in data.keys()


@pytest.mark.usefixtures("client")
def test_user_delete(client):
    """
    Deletes an existing user
    """
    response = client.delete("/{}/1".format(END_POINT))
    # Delete returns a 204 which is no content
    assert 204 == response.status_code


@pytest.mark.usefixtures("client")
def test_user_delete_noneistant(client):
    """
    Deletes an nonexistant user
    """
    res = client.delete("/{}/1000".format(END_POINT))

    data = res.data.decode("utf-8")

    # Delete returns a 204 which is no content
    assert 404 == res.status_code
    assert data == "No user found"
