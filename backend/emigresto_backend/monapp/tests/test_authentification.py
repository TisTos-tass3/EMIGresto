import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def user_data():
    return {
        "email": "testuser@example.com",
        "password": "TestPass123!",
        "nom": "Test",
        "prenom": "User",
        "matricule": "E1001",         # Important si ton modèle Etudiant le demande
        "telephone": "90000000"
    }

@pytest.mark.django_db
def test_register_user(client, user_data):
    url = reverse('auth-register')
    response = client.post(url, user_data, format="json")
    assert response.status_code == status.HTTP_201_CREATED, response.data
    assert response.data['email'] == user_data['email']

@pytest.mark.django_db
def test_login_user(client, user_data):
    client.post(reverse('auth-register'), user_data, format="json")
    response = client.post(
        reverse('token_obtain_pair'),
        {"email": user_data['email'], "password": user_data['password']},
        format="json"
    )
    assert response.status_code == status.HTTP_200_OK, response.data
    assert 'access' in response.data and 'refresh' in response.data

@pytest.mark.django_db
def test_login_wrong_password(client, user_data):
    client.post(reverse('auth-register'), user_data, format="json")
    response = client.post(
        reverse('token_obtain_pair'),
        {"email": user_data['email'], "password": "wrongpass"},
        format="json"
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED, response.data

@pytest.mark.django_db
def test_refresh_token(client, user_data):
    client.post(reverse('auth-register'), user_data, format="json")
    login = client.post(
        reverse('token_obtain_pair'),
        {"email": user_data['email'], "password": user_data['password']},
        format="json"
    )
    assert login.status_code == status.HTTP_200_OK
    refresh = login.data['refresh']
    response = client.post(reverse('token_refresh'), {"refresh": refresh}, format="json")
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data

@pytest.mark.django_db
def test_logout_user(client, user_data):
    client.post(reverse('auth-register'), user_data, format="json")
    login = client.post(
        reverse('token_obtain_pair'),
        {"email": user_data['email'], "password": user_data['password']},
        format="json"
    )
    access = login.data['access']
    refresh = login.data['refresh']
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    response = client.post(reverse('auth-logout'), {"refresh": refresh}, format="json")
    assert response.status_code == status.HTTP_205_RESET_CONTENT
