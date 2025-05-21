from rest_framework import serializers
from ..models.periode import Periode

class PeriodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periode
        fields = ['id', 'nomPeriode']
        read_only_fields = ['id', 'nomPeriode']
