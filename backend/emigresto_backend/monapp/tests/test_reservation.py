import pytest
from monapp.models import Reservation, Jour, Periode, Etudiant
from datetime import date, time

@pytest.mark.django_db
def test_reservation_crud(auth_client, create_user):
    # Préparation : créer un jour, une période et un étudiant
    etu = Etudiant.objects.create_user(email="e2@emig.ne", password="pass", nom="Nom", prenom="Pre")
    jour = Jour.objects.create(nomJour="Lundi")
    periode = Periode.objects.create(idPeriode=1, nomPeriode="Petit-déj")

    # Create
    data = {
        "jour": jour.idJour,
        "periode": periode.idPeriode,
        "date": date.today().isoformat(),
        "heure": time(8, 0).isoformat(),
        # l'étudiant par défaut depuis le fixture auth_client
        "etudiant": etu.id,
    }
    resp = auth_client.post("/api/reservations/", data)
    assert resp.status_code == 201
    rid = resp.data["id"]

    # Detail
    resp2 = auth_client.get(f"/api/reservations/{rid}/")
    assert resp2.status_code == 200
    assert resp2.data["statut"] == "VALIDE"

    # Update (annuler)
    resp3 = auth_client.patch(f"/api/reservations/{rid}/", {"statut": "ANNULE"})
    assert resp3.status_code == 200
    assert resp3.data["statut"] == "ANNULE"

    # Delete
    resp4 = auth_client.delete(f"/api/reservations/{rid}/")
    assert resp4.status_code == 204
    assert not Reservation.objects.filter(pk=rid).exists()
