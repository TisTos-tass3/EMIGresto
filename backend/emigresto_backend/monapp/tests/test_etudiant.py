import pytest
from django.urls import reverse
from monapp.models import Etudiant
from rest_framework import status


@pytest.mark.django_db
def test_etudiant_crud(auth_client):
    """
    Test complet du CRUD pour le modèle Etudiant via l'API :
    - Create
    - Read
    - Update
    - Delete
    """

    # 1) Créer un étudiant via l'API
    data = {
        "matricule": "E1234",
        "email": "etudiant@emig.ne",
        "nom": "Nom2",
        "prenom": "Prenom2",
        "password": "pass456",
        "telephone": "90001122"
    }

    resp = auth_client.post("/api/etudiants/", data, format="json")
    assert resp.status_code == status.HTTP_201_CREATED, resp.data
    eid = resp.data["id"]

    # 2) Lecture (GET /api/etudiants/{id}/)
    resp2 = auth_client.get(f"/api/etudiants/{eid}/")
    assert resp2.status_code == status.HTTP_200_OK, resp2.data
    assert resp2.data["matricule"] == data["matricule"]

    # 3) Mise à jour (PATCH /api/etudiants/{id}/)
    update_data = {"prenom": "NouveauPrenom"}
    resp3 = auth_client.patch(f"/api/etudiants/{eid}/", update_data, format="json")
    assert resp3.status_code == status.HTTP_200_OK
    assert resp3.data["prenom"] == "NouveauPrenom"

    # 4) Suppression (DELETE /api/etudiants/{id}/)
    resp4 = auth_client.delete(f"/api/etudiants/{eid}/")
    assert resp4.status_code == status.HTTP_204_NO_CONTENT
    assert not Etudiant.objects.filter(pk=eid).exists()
