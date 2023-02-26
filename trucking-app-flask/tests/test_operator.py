import pytest
import json
from config_test import app, client, session, user, company, customer, dispatch, operator

END_POINT = "v1/company/operators"



def test_get_operator(client, operator):
    """_summary_
        
        Get a operator
    Args:
        clinet (_type_): _description_
        operator (Operator): _description_
    """

    res = client.get(f"/{END_POINT}/{operator.operator_id}")
    data = res.json()

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
        operator (Operator): _description_
    """

    res = client.get(f"/{END_POINT}/99999")
    data = res.json()

    assert res.status_code == 404
    assert "error" in data.keys()
