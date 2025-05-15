from rest_framework import serializers
from ..models import RecuTicket

class RecuTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecuTicket
        fields = ['idRecu', 'dateEmission', 'montant', 'transaction_id']
        read_only_fields = ['idRecu', 'dateEmission', 'montant', 'transaction_id']
