import pytest
import json
from config_test import app, client, session, customer, company
from models.customer import Customer
END_POINT = "v1/company/customers"

def test_customer_post(client, company):
    """
    Test valid customer post
    """
    customer_name = "Test Customer"

    response = client.post(
        f"/{END_POINT}/{company.company_id}",
        data=json.dumps({"name": customer_name}),
        content_type="application/json"
    )
    print(f"DATA: {response.data}" )
    data = json.loads(response.data)
    
    assert response.status_code == 201
    assert "customer_id" in data.keys()
    assert type(data["customer_id"]) == int
    assert "company_id" in data.keys()
    assert data["company_id"] == company.company_id
    assert "customer_name" in data.keys()
    assert data["customer_name"] == customer_name


def test_customer_post_validation(client, company):
    """
        Test customer post validation
    """
    # Test missing fields
    response = client.post(f"/{END_POINT}/{company.company_id}", json={})
    data = json.loads(response.data)
    
    assert response.status_code == 400
    assert "error" in data.keys()
    assert data['error'] == "Name is required"

    # Test invalid company_id
    response = client.post(
       f"/{END_POINT}/ABC", json={"customer_name": "Test Customer"})
    assert response.status_code == 404

    # Test empty customer_name
    response = client.post(
        f"{END_POINT}/{company.company_id}", json={"customer_name": ""})
    data = json.loads(response.data)
    assert response.status_code == 400
    assert "error" in data.keys()
    assert data['error'] == "Name is required"


def test_delete_customer(client, session, customer):
    """
        Test deleting a customer that does not have any disaptches
    """
    # # test deleting a customer that has dispatches
    # dispatch = Dispatch(customer_id=customer.customer_id, dispatch_date="2022-01-01", amount=100)
    # session.add(dispatch)
    # session.commit()

    # response = client.delete(f"/{END_POINT}/{company.company_id}/customers/{customer.customer_id}")
    # assert response.status_code == 200

    # data = json.loads(response.data)
    # assert "message" in data
    # assert "deleted" in customer.__dict__
    # assert customer.deleted is True

    # test deleting a customer that doesn't have dispatches
    response = client.delete(f"{END_POINT}/{customer.company.company_id}/{customer.customer_id}")
    assert response.status_code == 200

    data = json.loads(response.data)
    assert "message" in data


def test_delete_customer_nonexistant(client): 
    """
    Test deleting a customer that does not exist
    """
    # test deleting a customer that doesn't exist
    response = client.delete(f"/company/1/{END_POINT}/1000")
    assert response.status_code == 404


def test_update_customer(client, customer):
    """
        Test updating a user
    """

    response = client.put(f'/{END_POINT}/{customer.company.company_id}/{customer.customer_id}', json={'customer_name': 'New Name'})
    data = json.loads(response.data)
    assert response.status_code == 200
    assert "message" in data.keys()
    assert "customer" in data.keys()
    assert "company_id" in data["customer"].keys()
    assert "customer_id" in data["customer"].keys()
    assert "customer_name" in data["customer"].keys()
    assert data["customer"]["customer_name"] == "New Name"

    # Test updating with missing data
    response = client.put(f'/{END_POINT}/{customer.company.company_id}/{customer.customer_id}', json={'invalid_key': 'Invalid Value'})
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert response.status_code == 200
    assert "message" in data.keys()
    assert "customer" in data.keys()
    assert "company_id" in data["customer"].keys()
    assert "customer_id" in data["customer"].keys()
    assert "customer_name" in data["customer"].keys()


def test_update_customer_not_found(client):
    """
        Updating a non existant customer
    """
    response = client.put(f'{END_POINT}/1/999', json={'customer_name': 'New Customer Name'})
    assert response.status_code == 404
    assert response.json == {'error': 'Customer not found'}
    

def test_update_customer_not_associated_with_company(client, customer, company):
    """
        Try updating a customer not associated to the company.
    """
    # send a request to update the customer
    response = client.put(f'/{END_POINT}/{company.company_id}/{customer.customer_id}', json={'customer_name': 'New Name'})

    # check the response
    print(response.data)
    assert response.status_code == 404
    assert response.json == {'error': 'Customer not found'}