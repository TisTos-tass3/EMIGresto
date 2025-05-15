# views.py
from rest_framework import viewsets
from ..models import Reservation, Ticket, Transaction, Paiement, Notification, Utilisateur, Etudiant
from ..serializers import (
    ReservationSerializer, TicketSerializer,
    TransactionSerializer, PaiementSerializer,
    NotificationSerializer, UtilisateurSerializer,
    EtudiantSerializer
)
from ..permission import IsAdmin, IsOwner, IsStudent

VIEWSET_REGISTRY = {
    'utilisateurs': (Utilisateur, UtilisateurSerializer),
    'etudiants'   : (Etudiant, EtudiantSerializer),
    'reservations': (Reservation, ReservationSerializer),
    'tickets'     : (Ticket, TicketSerializer),
    'transactions': (Transaction, TransactionSerializer),
    'paiements'   : (Paiement, PaiementSerializer),
    'notifications': (Notification, NotificationSerializer),
}

class BaseViewSet(viewsets.ModelViewSet):
    """ViewSet générique configurable via VIEWSET_REGISTRY."""
    def get_queryset(self):
        return self.model.objects.all()

    def get_serializer_class(self):
        return self.serializer_class

# Dynamique : création de classes
for route, (model, serializer) in VIEWSET_REGISTRY.items():
    attrs = {
        'queryset': model.objects.all(),
        'serializer_class': serializer,
    }
    viewset = type(f"{model.__name__}ViewSet", (viewsets.ModelViewSet,), attrs)
    globals()[f"{model.__name__}ViewSet"] = viewset
