import pytest
import json
from config_test import app, client, session, client_authed, user
from models import User
from utils.loader import UserFactory
END_POINT = "v1/user"


def test_user_get_authed(client_authed):
    """
    See if we can successfully perform GET requests on existing users and return their information
    """
    # arrange
    client, user = client_authed

    # act``
    response = client.get(f"{END_POINT}/{user.id}")

    # assertions
    assert 200 == response.status_code
    data = response.data.decode("utf-8")
    data = json.loads(data)
    assert "id" in data.keys()
    assert type(data["id"]) == int
    assert "role" in data.keys()
    assert "email" in data.keys()


def test_user_get_unauthed(client, user):
    """Try to get a user without being authed

    Args:
        client (_type_): _description_
    """
    # arrange

    # act
    res = client.get(f"{END_POINT}/{user.id}")

    print(res)
    # assert
    assert 401 == res.status_code


def test_user_get_another_user(client_authed):
    """
        Verify that we can perform GET requests with user IDs
        that don't exist in DB without crashing the app or returning
        valid users
    """
    # arrange
    client, user = client_authed

    response = client.get(f"{END_POINT}/1000")

    # convert response to dictionary
    data = json.loads(response.data.decode("utf-8"))

    # assertions
    assert 403 == response.status_code


def test_user_get_invalid_id_format(client_authed):
    """
    Verify that passing an invalid ID format will not work
    """
    # arrange
    client, user = client_authed

    # act
    response = client.get(f"{END_POINT}/ABCD")

    # assertions. Not found
    assert 404 == response.status_code


def test_user_post(client):
    """
        Create a valid user
    """
    payload = {
        "role": "dispatcher",
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
    assert payload['role'] == data["role"]
    assert payload['email'] == data["email"]


def test_user_post_invalid_role(client):
    """
    See if errors are returned for invalid role user data
    """

    # Invaid Role
    headers = {"Content-Type": "application/json"}
    payload = {
        "role": "None",
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
        "role": "dispatcher",
        "password": "Testing1",
        "email": "testdemo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    payload = {
        "role": "dispatcher",
        "password": "Testing1",
        "email": "test@democom",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    payload = {
        "role": "dispatcher",
        "password": "Testing1",
        "email": "@demo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()

    payload = {
        "role": "dispatcher",
        "password": "Testing1",
        "email": "test@demo.",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()


def test_user_post_invalid_password(client):
    """_summary_

    See if error is returned when a in invalid password is entered
    """
    # No Number
    headers = {"Content-Type": "application/json"}
    payload = {
        "role": "None",
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
        "role": "None",
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
        "role": "None",
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
        "role": "None",
        "password": "Test1",
        "email": "test@demo.com",
    }
    response = client.post(f"{END_POINT}/", headers=headers, json=payload)
    data = json.loads(response.data.decode("utf-8"))
    assert 400 == response.status_code
    assert "error" in data.keys()


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


def test_user_put(client_authed):
    """_summary_
        Test a valid post request
    """
    # Arrange
    client, user = client_authed
    headers = {"Content-Type": "application/json"}
    payload = user.to_dict()
    payload["email"] = "update@update.com"
    payload["role"] = "dispatcher"

    # Act
    response = client.put(
        f"{END_POINT}/{user.id}",
        headers=headers,
        json=payload
    )

    # assertions
    assert 200 == response.status_code
    data = response.data.decode("utf-8")
    data = json.loads(data)
    print(f"DATA: {data}")
    assert "email" in data.keys()
    assert payload["email"] == data["email"]
    assert "role" in data.keys()
    assert payload["role"] == data["role"]
    assert "id" in data.keys()


def test_user_put_another_user(client_authed):
    """Try to update another user

    Args:
        client_authed (_type_): _description_
    """
    # Arrange
    client, user = client_authed
    headers = {"Content-Type": "application/json"}
    payload = user.to_dict()
    payload["email"] = "update@update.com"
    payload["role"] = "dispatcher"

    # Act
    response = client.put(
        f"{END_POINT}/{user.id}",
        headers=headers,
        json=payload
    )

    # assertions
    assert 409 == response.status_code


def test_user_put_unauthenticated(client, user):
    """Try to update when unauthenticated

    Args:
        client (_type_): _description_
    """
    # Arrange
    headers = {"Content-Type": "application/json"}
    payload = user.to_dict()
    payload["email"] = "update@update.com"
    payload["role"] = "dispatcher"

    # Act
    response = client.put(
        f"{END_POINT}/{user.id}",
        headers=headers,
        json=payload
    )

    # assertions
    assert 401 == response.status_code


def test_user_delete(client_authed):
    """
    Deletes an existing user
    """
    # Arrange
    client, user = client_authed

    # Act
    res = client.delete(f"{END_POINT}/{user.id}")

    # assert
    assert 200 == res.status_code
    data = json.loads(res.data.decode("utf-8"))
    assert "message" in data.keys()
    assert data["message"] == "User deleted successfully."


def test_user_delete_another_user(client_authed):
    """
    Attemps to delete another user
    """
    # Arrange
    client, user = client_authed

    # act
    res = client.delete(f"{END_POINT}/1000")

    data = json.loads(res.data.decode("utf-8"))

    # Assert
    assert 403 == res.status_code
    assert "error" in data.keys()


def test_user_delete_unauthed(client, user):
    """Attempt to delete a user without auth

    Args:
        client (_type_): _description_
        user (_type_): _description_
    """

    # Arrange

    # Act
    res = client.delete(f"{END_POINT}/{user.id}")

    # Assert
    assert 401 == res.status_code
