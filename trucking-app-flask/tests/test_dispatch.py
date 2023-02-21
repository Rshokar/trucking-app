import pytest
import json
from config_test import app, client, session
END_POINT = "v1/dispatch"


def test_get_dispatch_success(client, session):
    # create a new dispatch in the database
    dispatch_id = 1

    # make a GET request to the route
    response = client.get(f'/dispatch/{dispatch_id}')
    data = json.loads(response.data)

    # assert that the response is successful and contains the dispatch data
    assert response.status_code == 200
    assert data['dispatch_id'] == dispatch_id

def test_get_dispatch_not_found(client):
    # make a GET request to the route with an invalid dispatch ID
    response = client.get('/dispatch/9999')
    data = json.loads(response.data)

    # assert that the response returns an error and status code 404
    assert response.status_code == 404
    assert data['error'] == 'Dispatch not found'