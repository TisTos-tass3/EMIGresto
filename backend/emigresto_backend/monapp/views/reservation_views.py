from rest_framework import viewsets, permissions
from monapp.models.reservations import Reservation
from monapp.serializers.reservation_serializer import (
    ReservationSerializer,
    ReservationCreateSerializer
)

class ReservationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filtrer les réservations pour que chaque utilisateur ne voie que ses propres réservations.
        """
        user = self.request.user
        try:
            etudiant = user.as_etudiant
            return Reservation.objects.filter(etudiant=etudiant)
        except Exception:
            return Reservation.objects.none()  # Si ce n'est pas un étudiant, retourner une liste vide

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ReservationCreateSerializer
        return ReservationSerializer

    def perform_create(self, serializer):
        """
        Lors de la création, associer automatiquement la réservation à l'étudiant connecté.
        """
        etudiant = self.request.user.as_etudiant
        serializer.save(etudiant=etudiant)
