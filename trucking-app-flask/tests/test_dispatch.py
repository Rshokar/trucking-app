import pytest
import json
from config_test import app, client, session
from models import User, Company, Dispatch
from datetime import datetime
END_POINT = "v1/dispatch"

@pytest.fixture
def company(session): 
    user = session.query(User).filter_by(id=1)


def test_get_dispatch_success(client):
    """
        Test valid get request
    """
    # create a new dispatch in the database
    dispatch_id = 1

    # make a GET request to the route
    response = client.get(f'/{END_POINT}/{dispatch_id}')
    data = json.loads(response.data)

    # assert that the response is successful and contains the dispatch data
    assert response.status_code == 200
    assert data['dispatch_id'] == dispatch_id


def test_get_dispatch_not_found(client):
    """
        Test valid get request with invalid 
        ID of non existant dispatch
    """
    dispatch_id = 999
    # make a GET request to the route with an invalid dispatch ID
    response = client.get(f'/{END_POINT}/{dispatch_id}')
    data = json.loads(response.data)

    # assert that the response returns an error and status code 404
    assert response.status_code == 404
    assert data['error'] == 'Dispatch not found'


# def test_create_dispatch(client, session):

#     # Make a POST request to create a new dispatch
#     data = {
#         'company_id': 6,
#         'customer_id':  1,
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
