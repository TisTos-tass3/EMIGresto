from rest_framework import viewsets
from ..models.periode import Periode
from ..serializers.periode_serializer import PeriodeSerializer

class PeriodeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Periode.objects.all()
    serializer_class = PeriodeSerializer
