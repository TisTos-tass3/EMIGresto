# monapp/tests/conftest.py
import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def client():
    """Client non authentifié."""
    return APIClient()


@pytest.fixture
def create_user(db):
    """
    Fournit une fonction pour créer un utilisateur rapidement.
    Usage :
        user = create_user(email="a@b.com", password="monpass", nom="X", prenom="Y")
    """
    def _make_user(email="user@example.com", password="password123", **extra_fields):
        return User.objects.create_user(email=email, password=password, **extra_fields)
    return _make_user


@pytest.fixture
def auth_client(client, create_user):
    """
    Client déjà authentifié :
      1. on crée un user
      2. on récupère un token via l’endpoint JWT
      3. on l’injecte dans les headers du client
    """
    # 1) création
    user = create_user(
        email="student@example.com",
        password="password123",
        nom="Test",
        prenom="Student",
        # téléphones et autres champs extra_fields seront ignorés si non gérés par le serializer
    )

    # 2) obtention du token
    resp = client.post(
        reverse("token_obtain_pair"),
        {"email": user.email, "password": "password123"},
        format="json"
    )
    assert resp.status_code == 200, "Impossible de récupérer le token JWT"
    access = resp.data["access"]

    # 3) injection dans le client
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    return client


@pytest.fixture(autouse=True)
def setup_jours_periodes(db):
    from monapp.models import Jour, Periode

    # 1) Vider les tables
    Jour.objects.all().delete()
    Periode.objects.all().delete()

    # 2) Remettre les séquences PostgreSQL à 1
    #    Attention : tes séquences s'appellent probablement "jour_idJour_seq" et "periode_idPeriode_seq"
    with connection.cursor() as c:
        c.execute('ALTER SEQUENCE "jour_idJour_seq" RESTART WITH 1;')
        c.execute('ALTER SEQUENCE "periode_idPeriode_seq" RESTART WITH 1;')

    # 3) Réinsérer
    for name in ["Lundi", "Mardi", "Mercredi"]:
        Jour.objects.create(nomJour=name)
    for name in ["PetitDéj", "Déjeuner", "Dîner"]:
        Periode.objects.create(nomPeriode=name)
