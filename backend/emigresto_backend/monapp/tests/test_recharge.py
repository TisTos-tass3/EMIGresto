# monapp/tests/test_recharge.py
import pytest
from django.urls import reverse
from rest_framework import status
from monapp.models import Etudiant, Recharge

@pytest.mark.django_db
def test_recharge_crud_and_solde(auth_client, create_user):
    # 1) On crée un étudiant avec solde initial = 0
    etu = create_user(email="recharge@emig.ne", password="pwd", solde=0)

    # 2) On poste une recharge de 1000 FCFA
    url = reverse('recharge-list')  # -> /api/recharges/
    resp = auth_client.post(url, {"montant": 1000, "moyen": "ESPECES"}, format='json')
    assert resp.status_code == status.HTTP_201_CREATED, resp.data
    rid = resp.data['id']

    # 3) Le solde de l'étudiant doit avoir été crédité
    etu.refresh_from_db()
    assert float(etu.solde) == 1000.0

    # 4) GET détail
    resp2 = auth_client.get(reverse('recharge-detail', args=[rid]), format='json')
    assert resp2.status_code == status.HTTP_200_OK
    assert resp2.data['montant'] == '1000.00'

    # 5) GET liste
    resp3 = auth_client.get(url, format='json')
    assert resp3.status_code == status.HTTP_200_OK
    assert any(r['id']==rid for r in resp3.data['results'])

    # 6) DELETE
    resp4 = auth_client.delete(reverse('recharge-detail', args=[rid]), format='json')
    assert resp4.status_code == status.HTTP_204_NO_CONTENT
    assert not Recharge.objects.filter(pk=rid).exists()

    # 7) Si on annule via l’action custom, le solde reste inchangé
    # (on recrée une recharge)
    resp = auth_client.post(url, {"montant": 500, "moyen": "CB"}, format='json')
    rid2 = resp.data['id']
    etu.refresh_from_db()
    assert float(etu.solde) == 1500.0  # cumul précédent + 500

    # on appelle /api/recharges/{rid2}/annuler/
    resp5 = auth_client.post(reverse('recharge-annuler', args=[rid2]), format='json')
    assert resp5.status_code == status.HTTP_204_NO_CONTENT
    etu.refresh_from_db()
    # on considère que l'annulation ne débite pas le compte
    assert float(etu.solde) == 1500.0
