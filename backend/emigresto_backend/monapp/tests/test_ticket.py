import pytest
from monapp.models import Ticket, Etudiant

@pytest.mark.django_db
def test_ticket_crud(auth_client, create_user):
    etu = create_user(email="t3@emig.ne")
    # Create petit-déj
    resp = auth_client.post("/api/tickets/", {"type_ticket": "PETIT"})
    assert resp.status_code == 201
    tid = resp.data["id"]
    assert resp.data["prix"] == 80

    # Create dej/dîner
    resp2 = auth_client.post("/api/tickets/", {"type_ticket": "DEJ"})
    assert resp2.status_code == 201
    assert resp2.data["prix"] == 125

    # List
    resp_list = auth_client.get("/api/tickets/")
    assert resp_list.status_code == 200
    assert len(resp_list.data["results"]) >= 2

    # Detail
    resp3 = auth_client.get(f"/api/tickets/{tid}/")
    assert resp3.status_code == 200
    assert resp3.data["type_ticket"] == "PETIT"

    # Delete
    resp4 = auth_client.delete(f"/api/tickets/{tid}/")
    assert resp4.status_code == 204
    assert not Ticket.objects.filter(pk=tid).exists()
