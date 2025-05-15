# backend/views/utilisateur_views.py
from rest_framework import viewsets
from ..models.utilisateur import Utilisateur
from ..serializers.utilisateur_serializer import UtilisateurSerializer

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
