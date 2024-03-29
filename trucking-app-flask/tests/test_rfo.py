import pytest
import json
import random
from datetime import datetime, timedelta
from config_test import (app,
                         client,
                         session,
                         user,
                         company,
                         customer,
                         dispatch,
                         operator,
                         operator_dispatch,
                         rfo,
                         multiple_operator_dispatch,
                         client_authed,
                         operator_dispatch_authed,
                         dispatch_authed,
                         rfo_authed,
                         billing_ticket
                         )
from utils.loader import CustomerFactory, OperatorFactory, DispatchFactory, RFOFactory
END_POINT = "v1/rfo"


def test_rfo_post(operator_dispatch_authed):
    client, oper, disp, user, comp, cus = operator_dispatch_authed

    payload = {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }
    res = client.post(f"/{END_POINT}/", json=payload)

    # convert response to dicitionary
    data = res.json
    print(f"DATA: {data}")

    # assertions
    assert res.status_code == 201
    assert "trailer" in data.keys()
    assert data["trailer"] == payload["trailer"]
    assert "truck" in data.keys()
    assert data["truck"] == payload["truck"]
    assert "start_location" in data.keys()
    assert data["start_location"] == payload["start_location"]
    assert "start_time" in data.keys()
    assert datetime.strptime(data["start_time"], '%a, %d %b %Y %H:%M:%S %Z') == datetime.strptime(
        payload["start_time"], "%Y-%m-%d %H:%M:%S")
    assert "dump_location" in data.keys()
    assert data["dump_location"] == payload["dump_location"]
    assert "dispatch_id" in data.keys()
    assert data["dispatch_id"] == payload["dispatch_id"]
    assert "operator_id" in data.keys()
    assert data["operator_id"] == payload["operator_id"]
    assert "load_location" in data.keys()
    assert data["load_location"] == payload["load_location"]


def test_rfo_post_missing_attributes(operator_dispatch_authed):
    # Arrange
    client, oper, disp, user, comp, cus = operator_dispatch_authed
    payloads = [{
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
    }]

    for payload in payloads:
        # Act
        res = client.post(f"/{END_POINT}/", json=payload)
        data = res.json

        # Assert
        assert res.status_code == 400
        assert "error" in data.keys()


def test_rfo_post_invalid_attributes(operator_dispatch_authed):

    # Arrange
    client, oper, disp, user, comp, cus = operator_dispatch_authed
    payloads = [{
        "dispatch_id": "ABC",
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": "ABC",
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "truck": "truck",
        "trailer": "trailer",
        "start_location": "",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_time": "2022-02-0202:02:02",
        "start_location": "start_location",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "dump_location": "",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "load_location": "load_location",
    }, {
        "dispatch_id": disp.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "",
    }]

    for payload in payloads:
        # Act
        res = client.post(f"/{END_POINT}/", json=payload)
        data = res.json

        # Assert
        assert res.status_code == 400
        assert "error" in data.keys()


def test_rfo_post_unauthed(client, operator_dispatch):
    """_summary_
        This tell will attempt to create an RFO without authorization
    Args:
        client (app): flask app
        operator_dispatch (array): array containing operator, dispatch, user, customer, and customer
    """
    # Arrange
    operator, dispatch, user, customer, company = operator_dispatch

    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 401


def test_rfo_post_rfo_to_another_company(operator_dispatch_authed, operator_dispatch):
    """_summary_
        This tell will attempt to create an RFO for another company

    Args:
        operator_dispatch_authed (Array): Array containing client, operator, dispatch, user, company, and customer
        operator_dispatch (Array): Array containing operator, dispatch, user, copmany, and customer
    """

    # Arrange
    client, oper, disp, user, comp, cus = operator_dispatch_authed  # Authenticated
    operator, dispatch, user, customer, company = operator_dispatch  # Other compnay

    payload = {
        "dispatch_id": dispatch.dispatch_id,
        "operator_id": oper.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 404


def test_rfo_post_rfo_add_another_compoanies_operator_to_rfo(operator_dispatch_authed, operator_dispatch):
    """_summary_
        This tell will attempt to create an RFO and add another
        companies operator to the RFO

    Args:
        operator_dispatch_authed (Array): Array containing client, operator, dispatch, user, company, and customer
        operator_dispatch (Array): Array containing operator, dispatch, user, copmany, and customer
    """

    # Arrange
    client, oper, disp, user, comp, cus = operator_dispatch_authed  # Authenticated
    operator, dispatch, user, customer, company = operator_dispatch  # Other compnay

    payload = {
        "dispatch_id": disp.dispatch_id,
        "operator_id": operator.operator_id,
        "trailer": "trailer",
        "truck": "truck",
        "start_location": "start_location",
        "start_time": "2022-02-02 02:02:02",
        "dump_location": "dump_location",
        "load_location": "load_location",
    }

    # Act
    res = client.post(f"/{END_POINT}/", json=payload)

    # Assert
    assert res.status_code == 404


def test_rfo_put(rfo_authed):
    """_summary_
        This tell will update an RFO
    Args:
        rfo_auth: (Array) Array containing client, rfo, operator, dispatch, user, company, and customer
    """

    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed
    payload = {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }

    res = client.put(f"/{END_POINT}/{rfo.rfo_id}", json=payload)
    data = res.json

    assert res.status_code == 200
    assert data["rfo_id"] == rfo.rfo_id
    assert data["dispatch_id"] == rfo.dispatch_id
    assert data["load_location"] == payload["load_location"]
    assert data["dump_location"] == payload["dump_location"]
    x = datetime.strptime(data["start_time"], '%a, %d %b %Y %H:%M:%S %Z')
    y = datetime.strptime(payload["start_time"], "%Y-%m-%d %H:%M:%S")
    assert x == y
    assert data["truck"] == payload["truck"]
    assert data["trailer"] == payload["trailer"]


def test_rfo_put_non_existing(client_authed):
    """_summary_
        This test will update an RFO that does not exist

    Args:
        rfo_authed: (Array) Array containing client, rfo, operator, dispatch, user, company, and customer
    """

    # Arrange
    client, user, comp = client_authed
    payload = {
        "operator_id": 999999,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }

    res = client.put(f"/{END_POINT}/999999", json=payload)
    data = res.json

    assert res.status_code == 404
    assert "error" in data.keys()
    assert data["error"] == "RFO not found"


def test_rfo_put_missing_attributes(rfo_authed):
    """_summary_
        This test will update an RFO with missing attributes

    Args:
        rfo_authed: (Array) Array containing client, rfo, operator, dispatch, user, company, and customer
    """
    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed
    payloads = [{
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
    }]

    for payload in payloads:
        res = client.put(f"/{END_POINT}/{rfo.rfo_id}", json=payload)
        data = res.json

        assert res.status_code == 400
        assert "error" in data.keys()


def test_rfo_put_invalid_attributes(rfo_authed):
    """_summary_
        This test will update an RFO with invalid attributes

    Args:
        rfo_authed: (Array) Array containing client, rfo, operator, dispatch, user, company, and customer
    """
    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed
    payloads = [{
        "operator_id": "ABC",
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "",
        "truck": "",
        "trailer": "Updated trailer",
    }, {
        "operator_id": rfo.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "",
        "truck": "Updated truck",
        "trailer": "",
    }]

    for payload in payloads:
        # Act
        res = client.put(f"/{END_POINT}/{rfo.rfo_id}", json=payload)
        data = res.json

        # Assert
        assert res.status_code == 400
        assert "error" in data.keys()


def test_rfo_put_update_invalid_operator(rfo_authed, operator):
    """_summary_
        Tries to update an RFO with an operator that is not owned by
        the same company that owns the dispatch.
    Args:
        rfo_authed (Array): Array containing client, rfo, operator, dispatch, user, company, and customer
        operator (_type_): _description_
    """
    # Invalid operator_id

    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed
    payload = {
        "operator_id": operator.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }

    # Act
    res = client.put(f"/{END_POINT}/{rfo.rfo_id}", json=payload)
    data = res.json

    # Assert
    assert res.status_code == 404
    assert "error" in data.keys()


def test_rfo_put_update_non_existing_operator(rfo_authed):
    """_summary_
        Tries to update an RFO with an operator that does not exist.
    Args:
        rfo_auther (Array): Array containing client, rfo, operator, dispatch, user, company, and customer
    """
    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed
    payload = {
        "operator_id": 9999999,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }

    # Act
    res = client.put(f"/{END_POINT}/{rfo.rfo_id}", json=payload)
    data = res.json

    # Assert
    assert res.status_code == 404
    assert "error" in data.keys()
    assert "Operator not found" in data["error"]


def test_rfo_put_unauthed(client, rfo):
    """_summary_
        Tries to update an RFO without being logged in.
    Args:
        client (App): Flask App
        ref (RFO): rfo
    """

    # Arrange
    rfo, user, customer, copmany, dispatch, operator = rfo
    payload = {
        "operator_id": operator.operator_id,
        "load_location": "Updated load_location",
        "dump_location": "Updated dump_location",
        "start_location": "Updated start_location",
        "start_time": "2022-02-02 02:02:02",
        "truck": "Updated truck",
        "trailer": "Updated trailer",
    }

    # Act
    res = client.put(f"/{END_POINT}/{rfo.rfo_id}", json=payload)

    # Assert
    assert res.status_code == 401


def test_rfo_get(rfo_authed):
    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed

    # Act
    res = client.get(f"/{END_POINT}/{rfo.rfo_id}")

    # Assert
    assert res.status_code == 200
    data = res.json
    assert data["rfo_id"] == rfo.rfo_id


def test_rfo_get_non_existing(client_authed):
    # Arrange
    client, user, comp = client_authed

    # Act
    res = client.get(f"/{END_POINT}/999999")

    assert res.status_code == 404
    data = res.json
    assert "error" in data.keys()


def test_rfo_get_unauthed(client, rfo):
    # Arrange
    rfo = rfo[0]

    # Act
    res = client.get(f"/{END_POINT}/{rfo.rfo_id}")

    # Assert
    assert res.status_code == 401


# # def test_rfo_get_all(client, session, multiple_operator_dispatch):
# #     NUM_RFOS = 1
# #     one = multiple_operator_dispatch[0]
# #     two = multiple_operator_dispatch[1]

# #     print(one)
# #     print(two)

# #     rfos = []

# #     # We need to create some data
# #     for i in range(NUM_RFOS):
# #         choice = random.choice([one, two])
# #         rfos.append(RFOFactory.create(
# #             operator_id=choice[1].operator_id,
# #             dispatch_id=choice[0].dispatch_id,
# #             load_location=f"load_location-{i}",
# #             dump_location=f"dump_location-{i}",
# #             start_location=f"start_location-{i}",
# #             start_time=datetime.now() + timedelta(days=i),
# #         ))

# #     print(rfos)

# #     # Look for all RFO with operator one id
# #     query = {
# #         "operator_id": one[1].operator_id,
# #     }

# #     res = client.get(f"/{END_POINT}/", query_string=query)
# #     data = res.json

# #     print(data)
# #     assert res.status_code == 200


def test_rfo_delete(rfo_authed):
    # Arrange
    client, rfo, user, oper, disp, comp, cus = rfo_authed

    # Act
    res = client.delete(f"/{END_POINT}/{rfo.rfo_id}")

    # Assert
    assert res.status_code == 200
    data = res.json
    assert "message" in data.keys()


def test_rfo_delete_non_existant(client_authed):
    # Arrange
    client, user, comp = client_authed

    # Act
    res = client.delete(f"/{END_POINT}/999999")

    # Assert
    assert res.status_code == 404
    data = res.json
    assert "error" in data.keys()


def test_rfo_delete_unauthed(client, rfo):
    # Arrange
    rfo = rfo[0]

    # Act
    res = client.delete(f"/{END_POINT}/{rfo.rfo_id}")

    # Assert
    assert res.status_code == 401


def test_rfo_delete_another_companies_rfo(rfo_authed, rfo):
    # Arrange
    client, requestForOperator, user, oper, disp, comp, cus = rfo_authed
    rfo = rfo[0]

    # Act
    res = client.delete(f"/{END_POINT}/{rfo.rfo_id}")

    # Assert
    assert res.status_code == 404
    data = res.json
    assert "error" in data.keys()


def test_rfo_get_all(client_authed):
    # Arrange
    client, user, comp = client_authed
    cust = CustomerFactory.create(company_id=comp.company_id)
    operOne = OperatorFactory.create(company_id=comp.company_id)
    operTwo = OperatorFactory.create(company_id=comp.company_id)

    dispOne = DispatchFactory.create(
        company_id=comp.company_id, customer_id=cust.customer_id)
    dispTwo = DispatchFactory.create(
        company_id=comp.company_id, customer_id=cust.customer_id)

    RFOFactory.create_batch(12, dispatch_id=dispOne.dispatch_id,
                            operator_id=operOne.operator_id)
    RFOFactory.create_batch(12, dispatch_id=dispTwo.dispatch_id,
                            operator_id=operTwo.operator_id)

    # Act
    res = client.get(f"/{END_POINT}/?dispatch_id={dispOne.dispatch_id}")

    # Assert
    assert res.status_code == 200
    data = res.json

    print(data)
    for disp in data:
        assert dispOne.dispatch_id == disp["dispatch_id"]
