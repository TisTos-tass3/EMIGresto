import pytest
from monapp.models.jour import Jour

@pytest.mark.django_db
def test_jour_crud(auth_client):
    # Create
    data = {"idJour":1, "nomJour": "Lundi"}
    resp = auth_client.post("/api/jours/", data)
    assert resp.status_code == 201
    jid = resp.data["idJour"]

    # List
    resp_list = auth_client.get("/api/jours/")
    assert resp_list.status_code == 200
    assert any(j["idJour"] == jid for j in resp_list.data["results"])

    # Detail
    resp2 = auth_client.get(f"/api/jours/{jid}/")
    assert resp2.status_code == 200
    assert resp2.data["nomJour"] == "Lundi"
    # Méthode custom
    assert isinstance(resp2.data["nbre_reserve_jour"], int)

    # Update
    resp3 = auth_client.patch(f"/api/jours/{jid}/", {"nomJour": "Mardi"})
    assert resp3.status_code == 200
    assert resp3.data["nomJour"] == "Mardi"

    # Delete
    resp4 = auth_client.delete(f"/api/jours/{jid}/")
    assert resp4.status_code == 204
    assert not Jour.objects.filter(pk=jid).exists()
