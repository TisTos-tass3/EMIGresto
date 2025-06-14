from django.db import models
from django.utils import timezone
from .etudiant import Etudiant

class Paiement(models.Model):
    MODES = [('CASH','Espèces'),('SOLDE','Solde')]
    id           = models.AutoField(db_column='id', primary_key=True)  # Field name made lowercase.
    etudiant     = models.ForeignKey(Etudiant, on_delete=models.CASCADE)
    date         = models.DateTimeField(default=timezone.now)
    montant      = models.DecimalField(max_digits=8, decimal_places=2)
    mode_paiement= models.CharField(max_length=6, choices=MODES)
    tickets_issued = models.PositiveIntegerField(editable=False)

    """
    def effectuer_paiement(self):
        #- CASH  → crédite le compte étudiant.
        #- SOLDE → débite le compte étudiant.
        if self.mode_paiement.upper() == 'CASH':
            # on crédite
            self.etudiant.crediter(self.montant)
        else:
            # SOLDE → on débite
            self.etudiant.debiter(self.montant)
        return True


    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        # Si c'est un nouvel enregistrement, on applique la logique
        if is_new:
            self.effectuer_paiement()
        """

    
    class Meta:
        db_table = 'paiement'
        indexes = [
            models.Index(fields=['date']),
        ]
        ordering = ['-date']  # Tri par défaut


