import pytest
import json
from config_test import app, client, session, user, company, customer, dispatch
from datetime import datetime
END_POINT = "v1/dispatch"


def test_get_dispatch_success(client, dispatch):
    """
        Test valid get request
    """
    
    # make a GET request to the route
    response = client.get(f'/{END_POINT}/{dispatch.dispatch_id}')
    data = json.loads(response.data)

    # assert that the response is successful and contains the dispatch data
    assert response.status_code == 200
    assert data['dispatch_id'] == dispatch.dispatch_id


def test_get_dispatch_not_found(client):
    """
        Test valid get request with non existant dispatch
    """
    dispatch_id = 999
    # make a GET request to the route with an invalid dispatch ID
    response = client.get(f'/{END_POINT}/{dispatch_id}')
    data = json.loads(response.data)

    # assert that the response returns an error and status code 404
    assert response.status_code == 404
    assert data['error'] == 'Dispatch not found'


def test_create_dispatch(client, customer):
    """_summary_

        Create a valid dispatch
    """

    # Make a POST request to create a new dispatch
    data = {
        'company_id': customer.company.company_id,
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }
    response = client.post(f'/{END_POINT}/', json=data)
    print(f"RETURNED DATA: {response.data}")
    assert response.status_code == 201

    # Check that the dispatch was created and returned in the response
    dispatch_data = response.json['dispatch']
    assert dispatch_data['company_id'] == data['company_id']
    assert dispatch_data['customer_id'] == data['customer_id']
    assert dispatch_data['notes'] == 'Test dispatch'
    assert datetime.strptime(dispatch_data['date'], '%a, %d %b %Y %H:%M:%S GMT') == datetime.strptime(
        data['date'], '%Y-%m-%d %H:%M:%S')

def test_create_dispatch_missing_attributes(client, customer):
    """_summary_

        Create a valid dispatch with missing parameters
    """

    # Make a POST request with missing company_id
    payload = {
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }
    response = client.post(f'/{END_POINT}/', json=payload)
    assert response.status_code == 400
    
    # Make a POST request with missing customer_id
    payload = {
        'company_id':  customer.company.company_id,
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }
    response = client.post(f'/{END_POINT}/', json=payload)
    assert response.status_code == 400
    
    
    # Make a POST request with missing notes
    payload = {
        'customer_id':  customer.customer_id,
        'company_id':  customer.company.company_id,
        'date': '2022-02-21 10:00:00'
    }
    response = client.post(f'/{END_POINT}/', json=payload)
    assert response.status_code == 400
    
    
    # Make a POST request with missing date
    payload = {
        'customer_id':  customer.customer_id,
        'company_id':  customer.company.company_id,
        'notes': 'Test dispatch',
    }
    response = client.post(f'/{END_POINT}/', json=payload)
    assert response.status_code == 400
    
def test_create_dispatch_invalid_attributes(client, customer):
    """_summary_

    Passes invalid attributes to endpoint
    
    Args:
        clinet (_type_): _description_
        customer (_type_): _description_
    """
    
    # Alphanumeric company_id
    payload = {
        'company_id': "ABC1",
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }
    response = client.post(f"/{END_POINT}/", json=payload)
    assert response.status_code == 400
    
    # Alphanumeric customer_id
    payload = {
        'company_id': customer.company.company_id,
        'customer_id':  "ABC1",
        'notes': 'Test dispatch',
        'date': '2022-02-21 10:00:00'
    }
    response = client.post(f"/{END_POINT}/", json=payload)
    assert response.status_code == 400
    
    
    # Invalid Date
    payload = {
        'company_id': customer.company.company_id,
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '10:00:00'
    }
    response = client.post(f"/{END_POINT}/", json=payload)
    assert response.status_code == 400
    
    # Invalid Date
    payload = {
        'company_id': customer.company.company_id,
        'customer_id':  customer.customer_id,
        'notes': 'Test dispatch',
        'date': '2022-02-21'
    }
    response = client.post(f"/{END_POINT}/", json=payload)
    assert response.status_code == 400