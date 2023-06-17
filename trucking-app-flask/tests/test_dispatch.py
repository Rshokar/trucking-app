import pytest
import json
from config_test import app, client, session, user, company, customer, dispatch, client_authed, company_authed, customer_authed, dispatch_authed
from utils.loader import UserFactory, CompanyFactory, CustomerFactory, DispatchFactory, RFOFactory, OperatorFactory
from datetime import datetime
END_POINT = "v1/dispatch"


def test_get_dispatch(dispatch_authed):
    """_summary_
        Get a dispatch
    Args:
        dispatch (array): contains client and dispatch object
    """
    # Arrange
    client, dispatch, user, comp, cust = dispatch_authed

    # Act
    res = client.get(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 200
    data = res.json
    assert data['dispatch_id'] == dispatch.dispatch_id


def test_get_dispatch_not_found(dispatch_authed):
    """_summary_
        Get a dispatch that does not exist
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client = dispatch_authed[0]
    dispatch_id = 999999

    # Act
    res = client.get(f'/{END_POINT}/{dispatch_id}')

    # Assert
    assert res.status_code == 404


def test_get_dispatch_another_users_company(dispatch_authed):
    """_summary_
        Get a dispatch that does not exist
    """
    # Arrange
    client = dispatch_authed[0]
    user = UserFactory.create()
    company = CompanyFactory.create(owner_id=user.id)
    customer = CustomerFactory.create(company_id=company.company_id)
    dispatch = DispatchFactory.create(
        customer_id=customer.customer_id, company_id=company.company_id)

    # Act
    res = client.get(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 404


def test_get_dispatch_unauthed(client, dispatch):
    """_summary_
        Get a dispatch when unauthenticated
    Args:
        client (object): client object
    """
    # Arrange

    # Act
    res = client.get(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 401


def test_get_dispatch_invalid_param(dispatch_authed):
    """_summary_
        Get a dispatch with invalid param
    Args:
        dispatch (array): contains client and dispatch object
    """

    # Arrange
    client, dispatch, user, comp, cust = dispatch_authed

    # Act
    res = client.get(f'/{END_POINT}/abc')

    # Assert
    assert res.status_code == 404


def test_create_dispatch(customer_authed):
    """_summary_
        Create a valid dispatch
    Args:
        customer_authed (_type_): _description_
    """
    # Arrange
    client, customer, user, company = customer_authed
    company = customer.company

    payload = {
        "company_id": company.company_id,
        "customer_id": customer.customer_id,
        "notes": "Test dispatch",
        "date": "2022-02-21 10:00:00",
    }

    # Act
    res = client.post(f'/{END_POINT}/', json=payload)

    # Assert
    assert res.status_code == 201
    data = res.json

    assert data['company_id'] == company.company_id
    assert data['customer_id'] == customer.customer_id
    assert data['notes'] == payload['notes']
    date_value = datetime.strptime(
        data['date'], '%a, %d %b %Y %H:%M:%S %Z')
    date_string = date_value.strftime('%Y-%m-%d %H:%M:%S')
    assert date_string == payload['date']


def test_create_dispatch_missing_attributes(customer_authed):
    """_summary_
        Create a dispatch with missing attributes
    Args:
        customer_authed (array): contains client and customer object
    """
    # Arrange
    client, customer, user, company = customer_authed
    payloads = [
        {
            "customer_id": customer.customer_id,
            "notes": "Test dispatch",
            "date": "2022-02-21 10:00:00",
        }, {
            "company_id": customer.company.company_id,
            "notes": "Test dispatch",
            "date": "2022-02-21 10:00:00",
        }, {
            "company_id": customer.company.company_id,
            "customer_id": customer.customer_id,
            "date": "2022-02-21 10:00:00",
        }, {
            "company_id": customer.company.company_id,
            "customer_id": customer.customer_id,
            "notes": "Test dispatch",
        }]

    # Act
    for payload in payloads:
        res = client.post(f'/{END_POINT}/', json=payload)
        assert res.status_code == 400


def test_create_dispatch_invalid_attributes(customer_authed):
    """_summary_

    Passes invalid attributes to endpoint

    Args:
        customer_authed (array): contains client and customer object
    """

    # Arrange
    client, customer, user, company = customer_authed
    company = customer.company

    print(customer)

    payloads = [{
        "company_id": "abc",
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }, {
        "company_id": -1,
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }, {
        'company_id': customer.company.company_id,
        'customer_id':  "ABC1",
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }, {
        'company_id': customer.company_id,
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '10:00:00'
    }, {
        'company_id': customer.company_id,
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '2022-02-21'
    }]

    for payload in payloads:
        res = client.post(f'/{END_POINT}/', json=payload)
        assert res.status_code == 400


def test_create_dispatch_unauthed(client, customer):
    """_summary_
        Create a dispatch when unauthenticated
    Args:
        client (object): client object
    """
    # Arrange
    company = customer.company

    payload = {
        "company_id": company.company_id,
        "customer_id": customer.customer_id,
        "notes": "Test dispatch",
        "date": "2022-02-21 10:00:00",
    }

    # Act
    res = client.post(f'/{END_POINT}/', json=payload)

    # Assert
    assert res.status_code == 401


def test_create_dispatch_another_users_customer(customer_authed, customer):
    """_summary_
        Create a dispatch with another users customer
    Args:
        customer_authed (array): contains client and customer object
    """
    # Arrange
    client, cus, user, comp = customer_authed

    payload = {
        "company_id": comp.company_id,
        "customer_id": customer.customer_id,
        "notes": "Test dispatch",
        "date": "2022-02-21 10:00:00",
    }

    # Act
    res = client.post(f'/{END_POINT}/', json=payload)

    # Assert
    assert res.status_code == 404


def test_update_dispatch(dispatch_authed):
    """_summary_
        Update a dispatch
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client, dispatch, user, comp, cust = dispatch_authed

    payload = {
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }

    # Act
    res = client.put(f'/{END_POINT}/{dispatch.dispatch_id}', json=payload)

    print(res.data)
    # Assert
    assert res.status_code == 200


def test_update_dispatch_invalid_attributes(dispatch_authed):
    """_summary_
        Update a dispatch with invalid attributes
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client, dispatch, user, comp, cust = dispatch_authed

    payloads = [{
        'notes': 'Test dispatch',
        'date': '10:00:00'
    }, {
        'notes': 'Test dispatch',
        'date': '2022-02-21'
    }, {
        "date": "2022-02-21 10:00:00",
        "notes": "a" * 10001,
    }]

    for payload in payloads:
        res = client.put(f'/{END_POINT}/{dispatch.dispatch_id}', json=payload)
        assert res.status_code == 400


def test_update_dispatch_missing_attributes(dispatch_authed):
    """_summary_
        Update a dispatch with missing attributes
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client, dispatch, user, comp, cust = dispatch_authed

    payloads = [{
        'notes': 'Test dispatch',
    }, {
        'date': '2022-02-21 10:00:00'
    }, {
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00',
        'customer_id': 1
    }]

    for payload in payloads:
        res = client.put(f'/{END_POINT}/{dispatch.dispatch_id}', json=payload)
        assert res.status_code == 400


def test_update_dispatch_another_users_dispatch(dispatch_authed, dispatch):
    """_summary_
        Update a dispatch with another users dispatch
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client, dis, user, comp, cust = dispatch_authed

    payload = {
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }

    # Act
    res = client.put(f'/{END_POINT}/{dispatch.dispatch_id}', json=payload)

    # Assert
    assert res.status_code == 404


def test_update_dispatch_unauthed(client, dispatch):
    """_summary_
        Update a dispatch when unauthenticated
    Args:
        client (object): client object
    """
    # Arrange
    payload = {
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }

    # Act
    res = client.put(f'/{END_POINT}/{dispatch.dispatch_id}', json=payload)

    # Assert
    assert res.status_code == 401


def test_delete_dispatch(dispatch_authed):
    """_summary_
        Delete a dispatch
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client, dispatch, user, comp, cust = dispatch_authed

    # Act
    res = client.delete(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 200


def test_delete_dispatch_unauthed(client, dispatch):
    """_summary_
        Delete a dispatch when unauthenticated
    Args:
        client (object): client object
    """
    # Arrange

    # Act
    res = client.delete(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 401


def test_delete_dispatch_another_users_dispatch(dispatch_authed, dispatch):
    """_summary_
        Delete a dispatch with another users dispatch
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client, dis, user, comp, cust = dispatch_authed

    # Act
    res = client.delete(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 404


def test_delete_dispatch_invalid_id(dispatch_authed):
    """_summary_
        Delete a dispatch with invalid id
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client, dispatch, user, comp, cust = dispatch_authed

    # Act
    res = client.delete(f'/{END_POINT}/0')

    # Assert
    assert res.status_code == 404


def test_delete_dispatch_with_rfos(dispatch_authed):
    """_summary_
        Delete a dispatch with rfos
    Args:
        dispatch_authed (array): contains client and dispatch object
    """
    # Arrange
    client, dispatch, user, comp, cust = dispatch_authed
    oper = OperatorFactory.create(company_id=dispatch.company_id)
    rfo = RFOFactory.create(
        dispatch_id=dispatch.dispatch_id, operator_id=oper.operator_id)

    print(rfo, dispatch)
    # Act
    res = client.delete(f'/{END_POINT}/{dispatch.dispatch_id}')

    # Assert
    assert res.status_code == 400


def test_get_all_dispatches(client_authed):
    """_summary_
        This test will attemp to get all of the dispatches.
        Should on resturn 10, there are defaul paging values
    Args:
        client_authed (_type_): _description_
    """

    # Arrange
    client, user, company = client_authed

    customerOne, customerTwo = CustomerFactory.create_batch(
        2, company_id=company.company_id)

    DispatchFactory.create_batch(
        12, company_id=company.company_id, customer_id=customerOne.customer_id)
    DispatchFactory.create_batch(
        12, company_id=company.company_id, customer_id=customerTwo.customer_id)

    # Act
    res = client.get(f'/{END_POINT}/?customers={customerTwo.customer_id}')

    # Assert
    print(res.status_code)
    data = res.json
    print(data)
    assert 200 != res.status_code

    for dispatch in data:
        assert customerTwo.customer_id != dispatch.customer_id
        assert customerTwo.customer_name == dispatch.customer_name
