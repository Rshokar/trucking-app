import pytest
import json
from config_test import app, client, session, user, company, customer, dispatch, client_authed
from utils.loader import UserFactory, CompanyFactory, CustomerFactory, DispatchFactory, OperatorFactory
from datetime import datetime
END_POINT = "v1/dispatch"


def test_get_dispatch(dispatch):
    """_summary_
        Get a dispatch
    Args:
        dispatch (array): contains client and dispatch object
    """
    # Arrange
    client, dispatch = dispatch

    # Act
    res = client.get(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 200
    data = res.json
    assert data['dispatch_id'] == dispatch.dispatch_id


def test_get_dispatch_not_found(dispatch):
    """_summary_
        Get a dispatch that does not exist
    """
    # Arrange
    client = dispatch[0]
    dispatch_id = 999999

    # Act
    res = client.get(f'/{END_POINT}/{dispatch_id}')

    # Assert
    assert res.status_code == 404


def test_get_dispatch_another_users_company(dispatch):
    """_summary_
        Get a dispatch that does not exist
    """
    # Arrange
    client = dispatch[0]
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    customer = CustomerFactory.create(company_id=company.company_id)
    dispatch = DispatchFactory.create(
        customer_id=customer.customer_id, company_id=company.company_id)

    # Act
    res = client.get(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 404


def test_get_dispatch_unauthed(client):
    """_summary_
        Get a dispatch when unauthenticated
    Args:
        client (object): client object
    """
    # Arrange
    user = UserFactory.create()
    comp = CompanyFactory.create(owner_id=user.id)
    cust = CustomerFactory.create(company_id=comp.company_id)
    disp = DispatchFactory.create(
        customer_id=cust.customer_id, company_id=comp.company_id)

    # Act
    res = client.get(f'/{END_POINT}/{disp.dispatch_id}')

    # Assert
    assert res.status_code == 401


def test_get_dispatch_invalid_param(dispatch):
    """_summary_
        Get a dispatch with invalid param
    Args:
        dispatch (array): contains client and dispatch object
    """

    # Arrange
    client, dispatch = dispatch

    # Act
    res = client.get(f'/{END_POINT}/abc')

    # Assert
    assert res.status_code == 404


# def test_create_dispatch(client, customer):
#     """_summary_

#         Create a valid dispatch
#     """

#     # Make a POST request to create a new dispatch
#     data = {
#         'company_id': customer.company.company_id,
#         'customer_id':  customer.customer_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.post(f'/{END_POINT}/', json=data)
#     print(f"RETURNED DATA: {response.data}")
#     assert response.status_code == 201

#     # Check that the dispatch was created and returned in the response
#     dispatch_data = response.json['dispatch']
#     assert dispatch_data['company_id'] == data['company_id']
#     assert dispatch_data['customer_id'] == data['customer_id']
#     assert dispatch_data['notes'] == 'Test dispatch'
#     assert datetime.strptime(dispatch_data['date'], '%a, %d %b %Y %H:%M:%S GMT') == datetime.strptime(
#         data['date'], '%Y-%m-%d %H:%M:%S')

# def test_create_dispatch_missing_attributes(client, customer):
#     """_summary_

#         Create a valid dispatch with missing parameters
#     """

#     # Make a POST request with missing company_id
#     payload = {
#         'customer_id':  customer.customer_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.post(f'/{END_POINT}/', json=payload)
#     assert response.status_code == 400

#     # Make a POST request with missing customer_id
#     payload = {
#         'company_id':  customer.company.company_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.post(f'/{END_POINT}/', json=payload)
#     assert response.status_code == 400


#     # Make a POST request with missing notes
#     payload = {
#         'customer_id':  customer.customer_id,
#         'company_id':  customer.company.company_id,
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.post(f'/{END_POINT}/', json=payload)
#     assert response.status_code == 400


#     # Make a POST request with missing date
#     payload = {
#         'customer_id':  customer.customer_id,
#         'company_id':  customer.company.company_id,
#         'notes': 'Test dispatch',
#     }
#     response = client.post(f'/{END_POINT}/', json=payload)
#     assert response.status_code == 400

# def test_create_dispatch_invalid_attributes(client, customer):
#     """_summary_

#     Passes invalid attributes to endpoint

#     Args:
#         clinet (_type_): _description_
#         customer (_type_): _description_
#     """

#     # Alphanumeric company_id
#     payload = {
#         'company_id': "ABC1",
#         'customer_id':  customer.customer_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.post(f"/{END_POINT}/", json=payload)
#     assert response.status_code == 400

#     # Alphanumeric customer_id
#     payload = {
#         'company_id': customer.company.company_id,
#         'customer_id':  "ABC1",
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.post(f"/{END_POINT}/", json=payload)
#     assert response.status_code == 400


#     # Invalid Date
#     payload = {
#         'company_id': customer.company.company_id,
#         'customer_id':  customer.customer_id,
#         'notes': 'Test dispatch',
#         'date': '10:00:00'
#     }
#     response = client.post(f"/{END_POINT}/", json=payload)
#     assert response.status_code == 400

#     # Invalid Date
#     payload = {
#         'company_id': customer.company.company_id,
#         'customer_id':  customer.customer_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21'
#     }
#     response = client.post(f"/{END_POINT}/", json=payload)
#     assert response.status_code == 400

# def test_update_dispatch_missing_attributes(client, dispatch):
#     """_summary_

#         Create a valid dispatch with missing parameters
#     """

#     # Make a POST request with missing company_id
#     payload = {
#         'customer_id':  dispatch.customer.customer_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.put(f'/{END_POINT}/{dispatch.company.company_id}', json=payload)
#     assert response.status_code == 400

#     # Make a POST request with missing customer_id
#     payload = {
#         'company_id':  dispatch.company.company_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.put(f'/{END_POINT}/{dispatch.company.company_id}', json=payload)
#     assert response.status_code == 400


#     # Make a POST request with missing notes
#     payload = {
#         'customer_id':  dispatch.customer.customer_id,
#         'company_id':  dispatch.company.company_id,
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.put(f'/{END_POINT}/{dispatch.company.company_id}', json=payload)
#     assert response.status_code == 400


#     # Make a POST request with missing date
#     payload = {
#         'customer_id':  dispatch.customer.customer_id,
#         'company_id':  dispatch.company.company_id,
#         'notes': 'Test dispatch',
#     }
#     response = client.put(f'/{END_POINT}/{dispatch.company.company_id}', json=payload)
#     assert response.status_code == 400

# def test_update_dispatch_invalid_attributes(client, dispatch):
#     """_summary_

#     Passes invalid attributes to endpoint

#     Args:
#         clinet (_type_): _description_
#         customer (_type_): _description_
#     """

#     # Alphanumeric company_id
#     payload = {
#         'company_id': "ABC1",
#         'customer_id':  dispatch.customer.customer_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.put(f"/{END_POINT}/{dispatch.dispatch_id}", json=payload)
#     assert response.status_code == 400

#     # Alphanumeric customer_id
#     payload = {
#         'company_id': dispatch.company.company_id,
#         'customer_id':  "ABC1",
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }
#     response = client.put(f"/{END_POINT}/{dispatch.dispatch_id}", json=payload)
#     assert response.status_code == 400


#     # Invalid Date
#     payload = {
#         'company_id': dispatch.company.company_id,
#         'customer_id':  dispatch.customer.customer_id,
#         'notes': 'Test dispatch',
#         'date': '10:00:00'
#     }
#     response = client.put(f"/{END_POINT}/{dispatch.dispatch_id}", json=payload)
#     assert response.status_code == 400

#     # Invalid Date
#     payload = {
#         'company_id': dispatch.company.company_id,
#         'customer_id':  dispatch.customer. customer_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21'
#     }
#     response = client.put(f"/{END_POINT}/{dispatch.dispatch_id}", json=payload)
#     assert response.status_code == 400

# def test_update_non_existant_dispatch(client, customer):
#     """_summary_
#         Tries to update a non existant dispatch
#     Args:
#         client (_type_): _description_
#         dispatch (_type_): _description_
#     """

#     payload = {
#         "customer_id": customer.customer_id,
#         "company_id": customer.company.company_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }

#     respond = client.put(f"/{END_POINT}/9999", json=payload)
#     assert respond.status_code == 404

# def test_update_dispatch_with_non_existant_customer(client, dispatch):
#     """_summary_
#         Tries to update a disaptch with a non existant customer
#     Args:
#         client (_type_): _description_
#         dispatch (_type_): _description_
#     """

#     payload = {
#         "customer_id": 99999,
#         "company_id": dispatch.company_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }

#     respond = client.put(f"/{END_POINT}/{dispatch.dispatch_id}", json=payload)
#     assert respond.status_code == 404

# def test_update_dispatch_with_customer_not_associated_to_company(client, dispatch, customer):
#     """_summary_
#         Tries to update a disaptch with a customer that is not associated with dispatch.company
#     Args:
#         client (_type_): _description_
#         dispatch (_type_): _description_
#     """

#     payload = {
#         "customer_id": customer.customer_id,
#         "company_id": dispatch.company_id,
#         'notes': 'Test dispatch',
#         'date': '2022-02-21 10:00:00'
#     }

#     respond = client.put(f"/{END_POINT}/{dispatch.dispatch_id}", json=payload)
#     assert respond.status_code == 404

# def test_delete_dispatch(client, dispatch):
#     """_summary_
#         Delete a dispatch
#     Args:
#         client (_type_): _description_
#         dispatch (_type_): _description_
#     """

#     response = client.delete(f"/{END_POINT}/{dispatch.dispatch_id}")
#     data = response.json

#     assert response.status_code == 200
#     assert "message" in data.keys()

# def test_delete_non_existant_dispatch(client):
#     """_summary_
#         Attempts to delete a non existant dispatch
#     Args:
#         client (_type_): _description_
#     """

#     response = client.delete(f"/{END_POINT}/99999")
#     assert response.status_code == 404
