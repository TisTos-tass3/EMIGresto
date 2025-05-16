from rest_framework import serializers
from ..models.jour import Jour

class JourSerializer(serializers.ModelSerializer):
    total_reservations = serializers.SerializerMethodField()
    reservations_petit_dej = serializers.SerializerMethodField()
    reservations_dejeuner = serializers.SerializerMethodField()
    reservations_diner = serializers.SerializerMethodField()

    class Meta:
        model = Jour
        fields = [
            'id', 
            'nomJour',
            'total_reservations',
            'reservations_petit_dej',
            'reservations_dejeuner',
            'reservations_diner',
        ]
        read_only_fields = fields

    def get_total_reservations(self, obj):
        return obj.get_nbre_reserve_jour

    def get_reservations_petit_dej(self, obj):
        return obj.get_nbre_reserve_lendemain(1)  # ID période 1 = Petit Déj

    def get_reservations_dejeuner(self, obj):
        return obj.get_nbre_reserve_lendemain(2)  # ID période 2 = Déjeuner

    def get_reservations_diner(self, obj):
        return obj.get_nbre_reserve_lendemain(3)  # ID période 3 = Dîner
