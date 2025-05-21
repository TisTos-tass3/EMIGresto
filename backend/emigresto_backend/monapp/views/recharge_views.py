# monapp/views/recharge_viewset.py
from ..models.recharge import Recharge
from ..serializers.recharge_serializer import RechargeSerializer
from .base_viewset import BaseModelViewSet

class RechargeViewSet(BaseModelViewSet):
    queryset = Recharge.objects.select_related('etudiant').all()
    serializer_class = RechargeSerializer
    search_fields = ['etudiant__matricule', 'moyen']
    ordering_fields = ['date', 'montant']

    def perform_create(self, serializer):
        serializer.save(etudiant=self.request.user)
