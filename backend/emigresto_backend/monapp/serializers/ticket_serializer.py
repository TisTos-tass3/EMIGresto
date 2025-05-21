from rest_framework import serializers
from ..models.tickets import Ticket
from .etudiant_serializer import EtudiantSerializer

class TicketSerializer(serializers.ModelSerializer):
    etudiant   = EtudiantSerializer(read_only=True)
    qr_code    = serializers.CharField(read_only=True)
    prix       = serializers.IntegerField(read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'etudiant', 'type_ticket', 'prix', 'date_vente', 'qr_code']
        read_only_fields = ['id', 'etudiant', 'prix', 'date_vente', 'qr_code']
