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
    
    

def test_creat_operator_missing_attribute(client, company):
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
    
    