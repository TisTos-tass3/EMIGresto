# monapp/views/reservation_viewset.py
from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from ..models.reservations import Reservation
from ..serializers.reservation_serializer import ReservationSerializer , ReservationCreateSerializer

class ReservationViewSet(viewsets.ModelViewSet):
    queryset         = Reservation.objects.select_related(
                          'etudiant', 'reservant_pour', 'jour', 'periode'
                       ).all()
    permission_classes = [IsAuthenticated]
    filterset_fields = ['jour', 'periode', 'etudiant', 'reservant_pour', 'statut', 'date']
    search_fields    = ['etudiant__matricule', 'reservant_pour__matricule']

    def get_serializer_class(self):
        if self.action in ('create',):
            return ReservationCreateSerializer
        return ReservationSerializer

    def perform_create(self, serializer):
        # injecte automatiquement l'étudiant connecté
        serializer.save(etudiant=self.request.user)
