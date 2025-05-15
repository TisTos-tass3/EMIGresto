from django.db import models
from django.utils import timezone
from .etudiant import Etudiant

class Paiement(models.Model):
    MODES = [('CASH','Espèces'),('SOLDE','Solde')]
    etudiant     = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    date         = models.DateTimeField(default=timezone.now)
    montant      = models.DecimalField(max_digits=8, decimal_places=2)
    mode_paiement= models.CharField(max_length=6, choices=MODES)

    def effectuer_paiement(self):
        # log, webhook, intégration bancaires…
        return True
