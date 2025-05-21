# monapp/views/etudiant_viewset.py
from ..models.etudiant import Etudiant
from ..serializers.etudiant_serializer import EtudiantSerializer
from .base_viewset import BaseModelViewSet

class EtudiantViewSet(BaseModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer
    search_fields = ['matricule', 'nom', 'prenom']
    ordering_fields = ['matricule']
