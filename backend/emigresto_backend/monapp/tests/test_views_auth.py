import pytest

@pytest.mark.django_db
def test_register_and_login(api_client):
    # Inscription
    data = {"email":"new@e.com","password":"pwd","nom":"N","prenom":"P"}
    resp = api_client.post('/api/auth/register/', data)
    assert resp.status_code == 201

    # Login
    resp = api_client.post('/api/auth/token/', {'email':'new@e.com','password':'pwd'})
    assert resp.status_code == 200
    assert 'access' in resp.data and 'refresh' in resp.data

@pytest.mark.django_db
def test_me_endpoint(auth_client):
    resp = auth_client.get('/api/auth/me/')
    assert resp.status_code == 200
    assert 'email' in resp.data
