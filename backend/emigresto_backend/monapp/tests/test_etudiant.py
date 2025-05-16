# monapp/tests/test_etudiant.py
import pytest
from django.urls import reverse
from monapp.models import Etudiant
from rest_framework import status

@pytest.mark.django_db
def test_etudiant_crud(auth_client, create_user):
    """
    - On utilise auth_client (fixture) pour avoir un client déjà authentifié.
    - create_user pour créer un compte Étudiant.
    """
    # 1) Créer un compte ETUDIANT
    user = create_user(
        email="e23@emig.ne",
        password="secret123",
        nom="Nom",
        prenom="Prenom",
        role="ETUDIANT"
    )

    # 2) Create (POST /api/etudiants/)
    data = {
        "matricule": "E1234",
        "email": "e1234@emig.ne",
        "nom": "Nom2",
        "prenom": "Prenom2",
        "password": "pass456"
    }
    resp = auth_client.post("/api/etudiants/", data, format="json")
    assert resp.status_code == status.HTTP_201_CREATED, resp.data
    eid = resp.data["id"]

    # 3) Read (GET /api/etudiants/{eid}/)
    resp2 = auth_client.get(f"/api/etudiants/{eid}/")
    assert resp2.status_code == status.HTTP_200_OK
    assert resp2.data["matricule"] == "E1234"

    # 4) Update (PATCH /api/etudiants/{eid}/)
    upd = {"prenom": "Nouveau"}
    resp3 = auth_client.patch(f"/api/etudiants/{eid}/", upd, format="json")
    assert resp3.status_code == status.HTTP_200_OK
    assert resp3.data["prenom"] == "Nouveau"

    # 5) Delete (DELETE /api/etudiants/{eid}/)
    resp4 = auth_client.delete(f"/api/etudiants/{eid}/")
    assert resp4.status_code == status.HTTP_204_NO_CONTENT
    assert Etudiant.objects.filter(pk=eid).count() == 0
