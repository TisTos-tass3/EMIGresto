import pytest
from monapp.models import Paiement, Etudiant

@pytest.mark.django_db
def test_paiement_crud(auth_client, create_user):
    etu = create_user(email="t4@emig.ne")
    # Recharge solde
    resp = auth_client.post("/api/paiements/", {"montant": 500, "modePaiement": "solde"})
    assert resp.status_code == 201
    pid = resp.data["idPaiement"]
    assert resp.data["montant"] == 500

    # Detail
    resp2 = auth_client.get(f"/api/paiements/{pid}/")
    assert resp2.status_code == 200

    # Delete
    resp3 = auth_client.delete(f"/api/paiements/{pid}/")
    assert resp3.status_code == 204
    assert not Paiement.objects.filter(pk=pid).exists()
