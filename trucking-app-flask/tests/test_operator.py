import pytest
import json
from config_test import app, client, session, user, company, customer, dispatch, operator

END_POINT = "v1/company/operators"

def test_get_operator(client, operator):
    """_summary_
        
        Get a operator
    Args:
        clinet (_type_): _description_
        operator (Operator): Operator Object
    """

    res = client.get(f"/{END_POINT}/{operator.operator_id}")
    data = res.json

    assert res.status_code == 200
    assert "operator_id" in data.keys()
    assert "company_id" in data.keys()
    assert "operator_name" in data.keys()
    assert "operator_email" in data.keys()

def test_get_non_existant_user(client):
    """_summary_
        
        Get a operator
    Args:
        clinet (_type_): _description_
    """

    res = client.get(f"/{END_POINT}/99999")
    data = res.json

    assert res.status_code == 404
    assert "error" in data.keys()

def test_create_a_operator(client, company):
    """_summary_
        Creates a valid Operator
    Args:
        client (_type_): _description_
        company {Company}: A Company Object from DB
    """
    
    payload = {
        "company_id":company.company_id, 
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json
    
    assert res.status_code == 201
    assert "operator_id" in data.keys()
    assert "company_id" in data.keys()
    assert "operator_name" in data.keys()
    assert "operator_email" in data.keys()
    
def test_create_operator_missing_attribute(client, company):
    """_summary_
        Try's to create a operator with missing attributes
    Args:
        client (_type_): _description_
        company {Company}: A Company Object from DB
    """
    
    payload = {
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400
    
    payload = {
        "company_id": company.company_id,
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400
    
    payload = {
        "company_id": company.company_id,
        "operator_name": "Keving Gates", 
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400
        
def test_create_operator_invalid_attributes(client, company): 
    """_summary_
        Trying to create operators with invalid attributes
    Args:
        client (_type_): _description_
        company (_type_): _description_
    """
    payload = {
        "company_id": "ABC123",
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400
    
    
    payload = {
        "company_id": company.company_id,
        "operator_name": "", 
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400
    
    
    payload = {
        "company_id": company.company_id,
        "operator_name": "Keving Gates", 
        "operator_email": "gatorgatertown.us"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400
    
    payload = {
        "company_id": company.company_id,
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertownus"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400
    
    payload = {
        "company_id": company.company_id,
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertown."
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400
    
    
    payload = {
        "company_id": company.company_id,
        "operator_name": "Keving Gates", 
        "operator_email": "@gatertown.us"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    assert res.status_code == 400

def test_create_operator_with_email_already_taken(client, operator): 
    """_summary_
        Trie to create an operator with an email already take
    Args:
        client (_type_): _description_
        operator (_type_): _description_
    """
    
    
    payload = {
        "company_id":operator.company_id, 
        "operator_name": "Keving Gates", 
        "operator_email": operator.operator_email
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()
    
def test_update_a_operator(client, operator):
    """_summary_
        Updates an operator
    Args:
        client (_type_): _description_
        company {Company}: A Company Object from DB
    """
    
    payload = {
        "company_id": operator.company_id, 
        "operator_name": "Kevin Stain", 
        "operator_email": "alegator@gatorbay.org"
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    data = res.json
    
    print(f"DATA: {data}")
    
    print(data)
    assert res.status_code == 200
    assert "operator_id" in data.keys()
    assert data["operator_id"] == operator.operator_id
    assert data["company_id"] == operator.company_id
    assert data["operator_name"] == payload["operator_name"]
    assert data["operator_email"] == payload["operator_email"]

def test_update_operator_missing_attribute(client, operator):
    """_summary_
        Try's to update a operator with missing attributes
    Args:
        client (_type_): _description_
        company {Company}: A Company Object from DB
    """
    
    payload = {
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
    payload = {
        "company_id": operator.company_id,
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
    payload = {
        "company_id": operator.company_id,
        "operator_name": "Keving Gates", 
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
def test_update_operator_invalid_attributes(client, operator): 
    """_summary_
        Trying to update operators with invalid attributes
    Args:
        client (_type_): _description_
        company (_type_): _description_
    """
    payload = {
        "company_id": "ABC123",
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
    
    payload = {
        "company_id": operator.company_id,
        "operator_name": "", 
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
    
    payload = {
        "company_id": operator.company_id,
        "operator_name": "Keving Gates", 
        "operator_email": "gatorgatertown.us"
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
    payload = {
        "company_id": operator.company_id,
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertownus"
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
    payload = {
        "company_id": operator.company_id,
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertown."
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
    
    payload = {
        "company_id": operator.company_id,
        "operator_name": "Keving Gates", 
        "operator_email": "@gatertown.us"
    }
    
    res = client.put(f"/{END_POINT}/{operator.operator_id}", json=payload)
    assert res.status_code == 400
    
def test_update_non_existant_operator(client, company): 
    """_summary_
        Testing to see if you can update a non existant operators
    Args:
        client (_type_): _description_
    """
    
    payload = {
        "company_id":company.company_id, 
        "operator_name": "Kevin Stain", 
        "operator_email": "alegator@gatorbay.org"
    }
    
    res = client.put(f"/{END_POINT}/999999", json=payload)
    data = res.json
    
    assert res.status_code == 404
    assert "error" in data.keys()

def test_update_a_operator_with_duplicate_email(client, operator):
    """_summary_
        Try to update an operator with a duplicate email
    Args:
        client (_type_): _description_
        operator (_type_): _description_
    """
    # Create operator
    payload = {
        "company_id":operator.company_id, 
        "operator_name": "Keving Gates", 
        "operator_email": "gator@gatertown.us"
    }
    
    res = client.post(f"/{END_POINT}/", json=payload)
    data = res.json
    
    assert res.status_code == 201
    
    payload = {
        "company_id":operator.company_id, 
        "operator_name": "Keving Gates", 
        "operator_email": operator.operator_email
    }   
    
    operator_id = data["operator_id"]
    
    res = client.put(f"/{END_POINT}/{operator_id}", json=payload)
    data = res.json

    assert res.status_code == 400
    assert "error" in data.keys()
    
def test_delete_an_operator(client, operator): 
    """_summary_
        Try to delete an valid operator
    Args:
        client (): _description_
        operator (Operator): Operator Object
    """
    
    res = client.delete(f"/{END_POINT}/{operator.company_id}/{operator.operator_id}")
    data = res.json
    
    assert res.status_code == 200
    assert "message" in data.keys()

def test_delete_an_non_existant_operator(client, company): 
    """_summary_
        Try to delete non existant operator
    Args:
        client (app): _description_
        operator (Operator): Operator Object
    """
    
    res = client.delete(f"/{END_POINT}/{company.company_id}/999999")
    data = res.json
    
    assert res.status_code == 404
    assert "error" in data.keys()
    
    

def test_delete_an_operator_with_non_existant_company(client, operator): 
    """_summary_
        Try to delete an operator from a company that does not own it.
    Args:
        client (app): _description_
        operator (Operator): Operator Object
    """
    
    res = client.delete(f"/{END_POINT}/9999999/{operator.operator_id}")
    data = res.json
    
    print(data)
    
    assert res.status_code == 404
    assert "error" in data.keys()