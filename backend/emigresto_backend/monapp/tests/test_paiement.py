import pytest
from monapp.models import Paiement, Etudiant

@pytest.mark.django_db
def test_paiement_crud(auth_client, create_user):
    etu = create_user(email="t4@emig.ne", password="pwd")  # solde à 0 par défaut

    # Recharge de 500 → mode CASH
    resp = auth_client.post("/api/paiements/", {"montant": 500, "mode_paiement": "CASH"}, format="json")
    assert resp.status_code == 201
    etu.refresh_from_db()
    assert etu.solde == 500

    # Paiement avec le solde de 200 → mode SOLDE
    resp2 = auth_client.post("/api/paiements/", {"montant": 200, "mode_paiement": "SOLDE"}, format="json")
    assert resp2.status_code == 201
    etu.refresh_from_db()
    assert etu.solde == 300  # 500 - 200
    # Recharge solde
    resp = auth_client.post("/api/paiements/", {"montant": 500, "mode_paiement": "solde"})
    assert resp.status_code == 201
    pid = resp.data["id"]
    assert resp.data["montant"] == 500

    # Detail
    resp2 = auth_client.get(f"/api/paiements/{pid}/")
    assert resp2.status_code == 200

    # Delete
    resp3 = auth_client.delete(f"/api/paiements/{pid}/")
    assert resp3.status_code == 204
    assert not Paiement.objects.filter(pk=pid).exists()

import pytest
from monapp.models import Paiement, Etudiant

@pytest.mark.django_db
def test_paiement_crud(auth_client, create_user):
    # On crée un étudiant avec solde à 0
    etu = create_user(email="t4@emig.ne", password="pwd", solde=0)

    # 1) Recharge CASH de 500
    resp = auth_client.post("/api/paiements/", {
        "montant": 500,
        "mode_paiement": "CASH"
    }, format="json")
    assert resp.status_code == 201, resp.data
    etu.refresh_from_db()
    assert float(etu.solde) == 500.0

    # 2) Paiement au SOLDE de 200
    resp2 = auth_client.post("/api/paiements/", {
        "montant": 200,
        "mode_paiement": "SOLDE"
    }, format="json")
    assert resp2.status_code == 201, resp2.data
    etu.refresh_from_db()
    assert float(etu.solde) == 300.0  # 500 - 200

    # 3) CRUD Paiement final
    pid = resp2.data["id"]
    assert resp2.data["montant"] == 200

    # Detail
    resp_detail = auth_client.get(f"/api/paiements/{pid}/", format="json")
    assert resp_detail.status_code == 200

    # Delete (soft via action annuler ou hard delete selon implémentation)
    resp_del = auth_client.delete(f"/api/paiements/{pid}/", format="json")
    assert resp_del.status_code in (204, 200)
    assert not Paiement.objects.filter(pk=pid).exists()
