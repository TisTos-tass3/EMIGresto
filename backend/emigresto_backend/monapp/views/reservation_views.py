from rest_framework import viewsets, permissions
from monapp.models.reservations import Reservation
from monapp.serializers.reservation_serializer import (
    ReservationSerializer,
    ReservationCreateSerializer
)

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ReservationCreateSerializer
        return ReservationSerializer

    def perform_create(self, serializer):
        # ✅ Utilise as_etudiant pour obtenir une vraie instance d'étudiant
        etudiant = self.request.user.as_etudiant
        serializer.save(etudiant=etudiant)
