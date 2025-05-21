import pytest
from monapp.models.jour import Jour

@pytest.mark.django_db
def test_jour_crud(auth_client):
    # Create
    resp = auth_client.post("/api/jours/", {"nomJour": "Lundi"}, format="json")
    assert resp.status_code == 201, resp.data
    jid = resp.data["id"]

    # List
    resp_list = auth_client.get("/api/jours/", format="json")
    assert resp_list.status_code == 200
    assert any(j["id"] == jid for j in resp_list.data["results"])

    # Detail
    resp2 = auth_client.get(f"/api/jours/{jid}/", format="json")
    assert resp2.status_code == 200
    assert resp2.data["nomJour"] == "Lundi"
    assert isinstance(resp2.data["nbre_reserve_jour"], int)

    # Update
    resp3 = auth_client.patch(f"/api/jours/{jid}/", {"nomJour": "Mardi"}, format="json")
    assert resp3.status_code == 200
    assert resp3.data["nomJour"] == "Mardi"

    # Delete
    resp4 = auth_client.delete(f"/api/jours/{jid}/", format="json")
    assert resp4.status_code == 204
    assert not Jour.objects.filter(pk=jid).exists()
