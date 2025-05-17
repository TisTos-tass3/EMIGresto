# monapp/models/recharge.py
from django.db import models
from django.utils import timezone
from .etudiant import Etudiant

class Recharge(models.Model):
    id        = models.AutoField(primary_key=True)
    etudiant  = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='recharges')
    montant   = models.DecimalField(max_digits=8, decimal_places=2)
    date      = models.DateTimeField(default=timezone.now)
    moyen     = models.CharField(max_length=20, default='Espèces')  # ou 'Orange Money', etc.

    class Meta:
        db_table = 'recharge'
        ordering = ['-date']

    def effectuer(self):
        """Crédite automatiquement l’étudiant au moment du save()."""
        self.etudiant.crediter(self.montant)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new:
            self.effectuer()

    def __str__(self):
        return f"Recharge {self.montant} FCFA pour {self.etudiant.matricule} le {self.date:%d/%m/%Y}"
