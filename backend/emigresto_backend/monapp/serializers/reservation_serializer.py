from rest_framework import serializers
from ..models.reservations import Reservation
from .etudiant_serializer import EtudiantSerializer
from .jour_serializer import JourSerializer
from .periode_serializer import PeriodeSerializer

class ReservationSerializer(serializers.ModelSerializer):
    etudiant        = EtudiantSerializer(read_only=True)
    reservant_pour  = EtudiantSerializer(read_only=True)
    jour            = JourSerializer(read_only=True)
    periode         = PeriodeSerializer(read_only=True)
    beneficiaire    = serializers.SerializerMethodField()
    details         = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id', 'date', 'heure', 'statut',
            'etudiant', 'reservant_pour',
            'jour', 'periode',
            'beneficiaire', 'details'
        ]
        read_only_fields = ['id', 'statut', 'beneficiaire', 'details']

    def get_beneficiaire(self, obj):
        return EtudiantSerializer(obj.beneficiaire).data

    def get_details(self, obj):
        return obj.get_details()
