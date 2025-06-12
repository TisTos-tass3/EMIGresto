# monapp/views/etudiant_viewset.py

from rest_framework.permissions import AllowAny, IsAuthenticated
from ..models.etudiant import Etudiant
from ..serializers.etudiant_serializer import EtudiantSerializer
from .base_viewset import BaseModelViewSet

class EtudiantViewSet(BaseModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer
    search_fields = ['matricule', 'nom', 'prenom']
    ordering_fields = ['matricule']

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
