import pytest
import json
from config_test import app, client, session, user
from models import User
from utils.loader import UserFactory
END_POINT = "v1/user"


@pytest.mark.usefixtures("client")
def test_user_get(client, user):
    """
    See if we can successfully perform GET requests on existing users and return their information
    """
    response = client.get(f"{END_POINT}/{user.id}")

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
        Verify that we can perform GET requests with user IDs
        that don't exist in DB without crashing the app or returning
        valid users
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
    payload = {
        "type": "dispatcher",
        "password": "Testing1",
        "email": "test@demo.com"

    }
    headers = {"Content-Type": "application/json"}
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
def test_user_post_invalid_type(client):
    """
    See if errors are returned for invalid type user data
    """

    # Invaid Type
    headers = {"Content-Type": "application/json"}
    payload = {
        "type": "None",
        "password": "Testing1",
        "email": "test@demo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    # Invaid Email
    headers = {"Content-Type": "application/json"}
    payload = {
        "type": "dispatcher",
        "password": "Testing1",
        "email": "testdemo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    payload = {
        "type": "dispatcher",
        "password": "Testing1",
        "email": "test@democom",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    payload = {
        "type": "dispatcher",
        "password": "Testing1",
        "email": "@demo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    payload = {
        "type": "dispatcher",
        "password": "Testing1",
        "email": "test@demo.",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()


@pytest.mark.usefixtures("client")
def test_user_post_invalid_password(client):
    """_summary_

    See if error is returned when a in invalid password is entered
    """
    # No Number
    headers = {"Content-Type": "application/json"}
    payload = {
        "type": "None",
        "password": "Testing",
        "email": "test@demo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    # No uppercase
    headers = {"Content-Type": "application/json"}
    payload = {
        "type": "None",
        "password": "testing1",
        "email": "test@demo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    # No lowercase
    headers = {"Content-Type": "application/json"}
    payload = {
        "type": "None",
        "password": "TESTING1",
        "email": "test@demo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    # Less than 8 charactesr
    headers = {"Content-Type": "application/json"}
    payload = {
        "type": "None",
        "password": "Test1",
        "email": "test@demo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()


@pytest.mark.usefixtures("client")
def test_user_post_duplicate(client, user):
    """
        Checks to see if an error is returned when creating a
        duplicate user
    """
    payload = user.to_dict()
    payload["password"] = "Testing1"
    # Create user
    headers = {"Content-Type": "application/json"}
    response = client.post(
        f"{END_POINT}/",
        headers=headers,
        json=payload
    )

    # convert response to dictionary
    data = response.data.decode("utf-8")
    data = json.loads(data)

    # assertions
    assert response.status == '409 CONFLICT'
    assert "error" in data.keys()


@pytest.mark.usefixtures("client")
def test_user_put(client, user):
    """_summary_
        Test a valid post request
    """
    headers = {"Content-Type": "application/json"}
    payload = user.to_dict()
    payload["email"] = "update@update.com"
    payload["type"] = "dispatcher"
    print(user.to_dict())
    print(payload)
    response = client.put(
        f"{END_POINT}/{user.id}",
        headers=headers,
        json=payload
    )

    # convert response to dictionary
    data = response.data.decode("utf-8")
    data = json.loads(data)
    print(f"DATA: {data}")

    # assertions
    assert 200 == response.status_code
    assert "email" in data.keys()
    assert payload["email"] == data["email"]
    assert "type" in data.keys()
    assert payload["type"] == data["type"]
    assert "id" in data.keys()


@pytest.mark.usefixtures("client")
def test_user_delete(client, user):
    """
    Deletes an existing user
    """
    res = client.delete(f"{END_POINT}/{user.id}")
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
