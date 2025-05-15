from ..models.transaction import Transaction
from ..serializers.transaction_serializer import TransactionSerializer
from .base_viewset import BaseModelViewSet

class TransactionViewSet(BaseModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    ordering_fields = ['date']
