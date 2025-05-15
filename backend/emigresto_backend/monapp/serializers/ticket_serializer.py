from rest_framework import serializers
from ..models.tickets import Ticket
from .etudiant_serializer import EtudiantSerializer

class TicketSerializer(serializers.ModelSerializer):
    etudiant   = EtudiantSerializer(read_only=True)
    qr_code    = serializers.CharField(read_only=True)
    prix       = serializers.IntegerField(read_only=True)

    class Meta:
        model = Ticket
        fields = ['idTicket', 'etudiant', 'typeTicket', 'prix', 'dateVente', 'qr_code']
        read_only_fields = ['idTicket', 'etudiant', 'prix', 'dateVente', 'qr_code']
