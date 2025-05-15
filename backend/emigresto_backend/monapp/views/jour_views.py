# monapp/views/jour_viewset.py
from ..models.jour import Jour
from ..serializers.jour_serializer import JourSerializer
from .base_viewset import BaseModelViewSet

class JourViewSet(BaseModelViewSet):
    queryset = Jour.objects.all()
    serializer_class = JourSerializer
    search_fields = ['nomJour']
    ordering_fields = ['idJour']
