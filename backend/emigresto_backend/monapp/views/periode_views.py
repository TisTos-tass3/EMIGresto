# monapp/views/periode_viewset.py
from ..models.periode import Periode
from ..serializers.periode_serializer import PeriodeSerializer
from .base_viewset import BaseModelViewSet

class PeriodeViewSet(BaseModelViewSet):
    queryset = Periode.objects.all()
    serializer_class = PeriodeSerializer
    search_fields = ['nomPeriode']
    ordering_fields = ['id']
