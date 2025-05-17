# monapp/serializers/jour_serializer.py
from rest_framework import serializers
from ..models.jour import Jour

class JourSerializer(serializers.ModelSerializer):
    nbre_reserve_jour       = serializers.SerializerMethodField()
    reservations_petit_dej  = serializers.SerializerMethodField()
    reservations_dejeuner   = serializers.SerializerMethodField()
    reservations_diner      = serializers.SerializerMethodField()

    class Meta:
        model = Jour
        fields = [
            'id',
            'nomJour',
            'nbre_reserve_jour',
            'reservations_petit_dej',
            'reservations_dejeuner',
            'reservations_diner',
        ]
        read_only_fields = [
            'nbre_reserve_jour',
            'reservations_petit_dej',
            'reservations_dejeuner',
            'reservations_diner',
        ]

    def get_nbre_reserve_jour(self, obj):
        return obj.get_nbre_reserve_jour

    def get_reservations_petit_dej(self, obj):
        return obj.get_nbre_reserve_lendemain(1)

    def get_reservations_dejeuner(self, obj):
        return obj.get_nbre_reserve_lendemain(2)

    def get_reservations_diner(self, obj):
        return obj.get_nbre_reserve_lendemain(3)
