from ..models.recuTicket import RecuTicket
from ..serializers.recuTicket_serializer import RecuTicketSerializer
from .base_viewset import BaseModelViewSet

class RecuTicketViewSet(BaseModelViewSet):
    queryset = RecuTicket.objects.all()
    serializer_class = RecuTicketSerializer
    ordering_fields = ['date_emission']

