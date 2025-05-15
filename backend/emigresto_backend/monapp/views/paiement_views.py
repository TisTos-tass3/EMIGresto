from ..models.paiement import Paiement
from ..serializers.paiement_serializer import PaiementSerializer
from .base_viewset import BaseModelViewSet

class PaiementViewSet(BaseModelViewSet):
    queryset = Paiement.objects.all()
    serializer_class = PaiementSerializer
    search_fields = ['etudiant__matricule']
    ordering_fields = ['date_paiement']