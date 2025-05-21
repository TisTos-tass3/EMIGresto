# monapp/serializers/recharge_serializer.py
from rest_framework import serializers
from ..models.recharge import Recharge
from .etudiant_serializer import EtudiantSerializer

class RechargeSerializer(serializers.ModelSerializer):
    etudiant = EtudiantSerializer(read_only=True)

    class Meta:
        model = Recharge
        fields = ['id', 'etudiant', 'montant', 'moyen', 'date']
        read_only_fields = ['id', 'etudiant', 'date']
