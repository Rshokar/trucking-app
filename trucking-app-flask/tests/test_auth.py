import pytest
import requests
import json
from config_test import app, client, user, client_authed
END_POINT = "v1/auth"


def test_auth_login(client, user):
    """_summary_
    Test user login with valid credentials
    Args:
        client (app): Flask app
        user (User): User model
    """

    # Arrange
    payload = {
        "email": user.email,
        "password": "Testing1"
    }

    # Act
    res = client.post(f"/{END_POINT}/login", json=payload)

    # Assert

    cookie = next((cookie for cookie in client.cookie_jar if cookie.name == "session"),
                  None)
    assert cookie is not None
    assert 200 == res.status_code


def test_auth_login_missing_attributes(client, user):
    """_summary_
    Test user login with missing attributes
    Args:
        client (_type_): _description_
        user (_type_): _description_
    """

    # Arrange (missing password)
    payload = {
        "email": user.email,
    }

    # Act
    res = client.post(f"/{END_POINT}/login", json=payload)

    # Assert
    assert 400 == res.status_code

    # Arrange (missing email)
    payload = {
        "password": "Testing1"
    }

    # Act
    res = client.post(f"/{END_POINT}/login", json=payload)

    # Assert
    assert 400 == res.status_code


def test_auth_logout(client_authed):
    """_summary_
    Test user logout
    Args:
        client_authed (_type_): _description_
    """
    # Arrange
    client, user = client_authed

    # Act
    res = client.delete(f"/{END_POINT}/logout")

    # Assert
    assert 200 == res.status_code
    # check if cookie is deleted
    cookie = next((cookie for cookie in client.cookie_jar if cookie.name == "session"),
                  None)
    assert cookie is None


def test_auth_logout_unauthorized(client):
    """_summary_
    Test user logout without being logged in
    Args:
        client (_type_): _description_
    """
    # Arrange

    # Act
    res = client.delete(f"/{END_POINT}/logout")

    # Assert
    assert 401 == res.status_code
