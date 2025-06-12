import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from monapp.models import Etudiant, Jour, Periode

@pytest.fixture
def client():
    """Client non authentifié."""
    return APIClient()

@pytest.fixture
def create_user(db):
    """
    Crée un utilisateur de type Etudiant.
    Usage : user = create_user(email="a@b.com", password="monpass", nom="X", prenom="Y")
    """
    def _make_user(email="user@example.com", password="password123", **extra_fields):
        # Valeurs par défaut si manquants
        extra_fields.setdefault("nom", "Test")
        extra_fields.setdefault("prenom", "User")
        extra_fields.setdefault("matricule", "M123")
        extra_fields.setdefault("telephone", "90000000")
        return Etudiant.objects.create_user(email=email, password=password, **extra_fields)
    return _make_user

@pytest.fixture
def auth_client(client, create_user):
    """
    Client déjà authentifié avec un Etudiant.
    """
    user = create_user(
        email="student@example.com",
        password="password123",
        nom="Test",
        prenom="Student",
        matricule="ST123"
    )

    resp = client.post(
        reverse("token_obtain_pair"),
        {"email": user.email, "password": "password123"},
        format="json"
    )
    assert resp.status_code == 200, "Token JWT introuvable"
    token = resp.data["access"]
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
    return client

@pytest.fixture(autouse=True)
def setup_jours_periodes(db):
    """
    Création automatique de quelques jours/périodes avant chaque test.
    """
    Jour.objects.all().delete()
    Periode.objects.all().delete()

    for name in ["Lundi", "Mardi", "Mercredi"]:
        Jour.objects.create(nomJour=name)

    for name in ["PetitDéj", "Déjeuner", "DINER"]:
        Periode.objects.create(nomPeriode=name)
