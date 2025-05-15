from rest_framework import serializers
from ..models.transaction import Transaction
from .ticket_serializer import TicketSerializer
from .recuTicket_serializer import RecuTicketSerializer

class TransactionSerializer(serializers.ModelSerializer):
    ticket = TicketSerializer(read_only=True)
    recu   = RecuTicketSerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = ['idTransaction', 'date', 'montant', 'ticket', 'recu']
        read_only_fields = ['idTransaction', 'date', 'montant', 'ticket', 'recu']
