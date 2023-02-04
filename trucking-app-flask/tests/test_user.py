import pytest
import json
from config_test import app, client
END_POINT = "user"

# Get test data
with open('./data/user_test.json') as json_file:
    test_data = json.load(json_file)

# @pytest.mark.usefixtures("client")
# def test_user_get(client):

#     response = client.get("/{}/".format(END_POINT))

#     # convert response to dicitionary
#     data = response.data.decode("utf-8")
#     data = json.loads(data)

#     # assertions
#     assert "USER_GET" == data["data"]
#     assert 200 == response.status_code



@pytest.mark.usefixtures("client")
def test_user_post(client):
    """
        Create a valid user
    """
    headers = {"Content-Type": "application/json"}
    print(test_data)
    payload = test_data['User']
    response = client.post(
        "/{}/".format(END_POINT),
        headers=headers,
        json=payload
    )

    # convert response to dictionary
    data = response.data.decode("utf-8")
    print("RETURNED DATA: " + data)
    data = json.loads(data)

    # assertions
    assert payload['type'] == data["type"]
    assert payload['email'] == data["email"]
    assert 200 == response.status_code


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
        print("RETURNED DATA: " + data)

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
    print("RETURNED DATA: " + data)
    data = json.loads(data)

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
    print("RETURNED DATA: " + data)

    # assertions
    assert 409 == response.status_code


# @pytest.mark.usefixtures("client")
# def test_user_put(client):
#     response = client.put("/{}/".format(END_POINT))

#     # convert response to dicitionary
#     data = response.data.decode("utf-8")
#     data = json.loads(data)

#     # assertions
#     assert "USER_PUT" == data["data"]
#     assert 200 == response['status_code']


# @pytest.mark.usefixtures("client")
# def test_user_delete(client):
#     response = client.delete("/{}/".format(END_POINT))

#     # Delete returns a 204 which is no content
#     assert 204 == response.status_code
