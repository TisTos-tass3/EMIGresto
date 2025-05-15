from rest_framework import serializers
from ..models.periode import Periode

class PeriodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Periode
        fields = ['idPeriode', 'nomPeriode']
        read_only_fields = ['idPeriode', 'nomPeriode']
