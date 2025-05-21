from rest_framework import serializers
from ..models import RecuTicket

class RecuTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecuTicket
        fields = ['id', 'date_emission', 'montant', 'transaction_id']
        read_only_fields = ['id', 'date_emission', 'montant', 'transaction_id']
