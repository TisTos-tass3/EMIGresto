# monapp/views/reservation_viewset.py
from ..models.reservations import Reservation
from ..serializers.reservation_serializer import ReservationSerializer
from .base_viewset import BaseModelViewSet

class ReservationViewSet(BaseModelViewSet):
    queryset = Reservation.objects.select_related('etudiant', 'reservant_pour', 'jour', 'periode').all()
    serializer_class = ReservationSerializer
    filterset_fields = ['jour', 'periode', 'etudiant', 'reservant_pour', 'statut', 'date']
    search_fields = ['etudiant__matricule', 'reservant_pour__matricule']
