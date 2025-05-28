import pytest
from monapp.models.etudiant import Etudiant

@pytest.mark.django_db
def test_etudiant_crud(auth_client):
    # Create
    resp = auth_client.post('/api/etudiants/', {'matricule':'E001','nom':'X','prenom':'Y'})
    assert resp.status_code == 201
    eid = resp.data['id']

    # List
    resp = auth_client.get('/api/etudiants/')
    assert resp.status_code == 200
    assert any(e['id']==eid for e in resp.data['results'])

    # Update
    resp = auth_client.patch(f'/api/etudiants/{eid}/', {'prenom':'Z'})
    assert resp.data['prenom'] == 'Z'

    # Delete
    resp = auth_client.delete(f'/api/etudiants/{eid}/')
    assert resp.status_code == 204
