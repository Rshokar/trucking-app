import pytest
import json
from config_test import app, client
import os

END_POINT = "/user"

# Get test data
with open('./data/user_test.json') as json_file:
    test_data = json.load(json_file)


@pytest.mark.usefixtures("client")
def test_user_get(client):
    """
    See if we can successfully perform GET requests on existing users and return their information
    """
    response = client.get(f"{END_POINT}/1")

    # convert response to dictionary
    data = response.data.decode("utf-8")
    print("RETURNED DATA: " + data)
    data = json.loads(data)

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
    response = client.get(f"{END_POINT}/1000")

    # convert response to dictionary
    data = json.loads(response.data.decode("utf-8"))

    # assertions
    assert 404 == response.status_code
    assert "error" in data.keys()
    assert data["error"] == "User not found."


def test_user_invalid_id_format(client):
    """
    Verify that passing an invalid ID format will not work
    """
    response = client.get(f"{END_POINT}/ABCD")

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
        f"{END_POINT}/",
        headers=headers,
        json=payload
    )

    # convert response to dictionary
    data = response.data.decode("utf-8")
    print(f"DATA: {data}")
    data = json.loads(data)
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
            f"{END_POINT}/",
            headers=headers,
            json=payload
        )

        # convert response to dictionary
        data = json.loads(response.data.decode("utf-8"))
        print(data)

        # assertions
        assert 400 == response.status_code
        assert user['error'] == data['error']


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
        f"{END_POINT}/",
        headers=headers,
        json=payload
    )

    # convert response to dictionary
    data = response.data.decode("utf-8")
    data = json.loads(data)

    # assertions
    assert payload['type'] == data["type"]
    assert payload['email'] == data["email"]

    print("User created successfully!")


@pytest.mark.usefixtures("client")
def test_user_put(client):
    payload = test_data['UpdateUser']
    headers = {"Content-Type": "application/json"}
    response = client.put(
        f"{END_POINT}/1",
        headers=headers,
        json=payload
    )

    # convert response to dictionary
    data = response.data.decode("utf-8")
    print(f"DATA: {data}")
    data = json.loads(data)

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
    res = client.delete(f"{END_POINT}/1")
    # Delete returns a 204 which is no content

    data = json.loads(res.data.decode("utf-8"))

    assert 200 == res.status_code
    assert "message" in data.keys()
    assert data["message"] == "User deleted successfully."


@pytest.mark.usefixtures("client")
def test_user_delete_noneistant(client):
    """
    Deletes a non-existent user
    """
    res = client.delete(f"{END_POINT}/1000")

    data = json.loads(res.data.decode("utf-8"))

    # Delete returns a 204 which is no content
    assert 404 == res.status_code
    assert "error" in data.keys()
    assert data['error'] == "User not found."
