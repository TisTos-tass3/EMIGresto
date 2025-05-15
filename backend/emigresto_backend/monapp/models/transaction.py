from django.db import models
from .tickets import Ticket
from .paiement import Paiement

class Transaction(models.Model):
    ticket    = models.OneToOneField(Ticket, on_delete=models.PROTECT)
    paiement  = models.OneToOneField(Paiement, on_delete=models.PROTECT)
    date      = models.DateTimeField(auto_now_add=True)
    montant   = models.DecimalField(max_digits=8, decimal_places=2)

    def enregistrer(self):
        self.save()
