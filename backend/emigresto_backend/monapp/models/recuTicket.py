from django.db import models
from .transaction import Transaction


class RecuTicket(models.Model):
    date_emission = models.DateTimeField(auto_now_add=True)
    montant = models.DecimalField(max_digits=6, decimal_places=2)
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE)

    def __str__(self):
        return f"Reçu de tickets {self.id}"

