# monapp/views/base_viewset.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class BaseModelViewSet(viewsets.ModelViewSet):
    """
    Vue de base générique, réutilisable pour tous les modèles.
    Elle gère : CRUD, permissions, filtres, recherche, tri, pagination.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = '__all__'     # Tu peux personnaliser par modèle
    search_fields = '__all__'
    ordering_fields = '__all__'
