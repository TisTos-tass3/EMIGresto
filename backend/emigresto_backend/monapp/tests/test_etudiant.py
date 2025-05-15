# monapp/tests/test_etudiant.py
import pytest
from django.urls import reverse
from monapp.models import Etudiant
from rest_framework import status

@pytest.mark.django_db
def test_etudiant_crud(api_client, create_user):
    # 1) Créer un compte ETUDIANT
    user = create_user(
        email="e123@emig.ne",
        password="secret123",
        nom="Nom",
        prenom="Prenom",
        role="ETUDIANT"
    )

    # 2) Récupérer le token JWT
    login = api_client.post(
        reverse("token_obtain_pair"),
        {"email": user.email, "password": "secret123"},
        format="json"
    )
    assert login.status_code == status.HTTP_200_OK
    token = login.data["access"]
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # 3) Create (POST /api/etudiants/)
    data = {
        "matricule": "E123",
        "email": "e123@emig.ne",
        "nom": "Nom2",
        "prenom": "Prenom2",
        "password": "pass456"
    }
    resp = api_client.post("/api/etudiants/", data, format="json")
    assert resp.status_code == status.HTTP_201_CREATED
    eid = resp.data["id"]

    # 4) Read (GET /api/etudiants/{eid}/)
    resp2 = api_client.get(f"/api/etudiants/{eid}/")
    assert resp2.status_code == status.HTTP_200_OK
    assert resp2.data["matricule"] == "E123"

    # 5) Update (PATCH /api/etudiants/{eid}/)
    upd = {"prenom": "Nouveau"}
    resp3 = api_client.patch(f"/api/etudiants/{eid}/", upd, format="json")
    assert resp3.status_code == status.HTTP_200_OK
    assert resp3.data["prenom"] == "Nouveau"

    # 6) Delete (DELETE /api/etudiants/{eid}/)
    resp4 = api_client.delete(f"/api/etudiants/{eid}/")
    assert resp4.status_code == status.HTTP_204_NO_CONTENT
    assert Etudiant.objects.filter(pk=eid).count() == 0
