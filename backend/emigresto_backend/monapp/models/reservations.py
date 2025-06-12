# restoapp/models/reservation.py
from django.db import models
from django.utils import timezone
from .etudiant import Etudiant
from .jour import Jour
from .periode import Periode

class Reservation(models.Model):
    STATUT_CHOICES = [
        ('VALIDE', 'Valide'),
        ('ANNULE', 'Annulée'),
    ]

    id          = models.BigAutoField(primary_key=True)
    date        = models.DateField(default=timezone.now)
    heure       = models.TimeField(default=timezone.now)
    statut      = models.CharField(max_length=10, choices=STATUT_CHOICES, default='VALIDE')
    etudiant    = models.ForeignKey(  
        Etudiant,
        on_delete=models.CASCADE,
        related_name='reservations_effectuees',
        help_text="L'étudiant qui initie la réservation"
    )
    reservant_pour = models.ForeignKey(
        Etudiant,
        on_delete=models.CASCADE,
        related_name='reservations_recueillies',
        null=True,
        blank=True,
        help_text="Optionnel : matricule du camarade pour qui on réserve"
    )
    jour        = models.ForeignKey(
        Jour,
        on_delete=models.PROTECT,
        related_name='reservations',
        help_text="Jour de la réservation"
    )
    periode     = models.ForeignKey(
        Periode,
        on_delete=models.PROTECT,
        related_name='reservations',
        help_text="Période (petit-déj, midi, soir)"
    )

    class Meta:
        db_table = 'reservation'
        unique_together = ('reservant_pour', 'jour', 'periode', 'date')
        # On garantit qu'un même bénéficiaire ne soit pas réservé deux fois pour même slot.

    def __str__(self):
        benef = self.reservant_pour or self.etudiant
        return f"Resa#{self.id} pour {benef.matricule} le {self.jour.nomJour} ({self.periode.nomPeriode})"

    def creer(self):
        """Valide et enregistre une nouvelle réservation."""
        if Reservation.objects.filter(
            reservant_pour=self.reservant_pour or self.etudiant,
            jour=self.jour,
            periode=self.periode,
            date=self.date
        ).exists():
            raise ValueError("Double réservation détectée pour ce créneau.")
        self.save()

    def annuler(self):
        """Annule la réservation (soft)."""
        self.statut = 'ANNULE'
        self.save(update_fields=['statut'])

    def modifier(self, **kwargs):
        """
        Modifie un ou plusieurs champs de la réservation.
        Usage : instance.modifier(jour=new_jour, periode=new_periode)
        """
        allowed = {'date', 'heure', 'jour', 'periode', 'statut', 'reservant_pour'}
        for field, val in kwargs.items():
            if field in allowed:
                setattr(self, field, val)
        self.save()

    @property
    def beneficiaire(self):
        """Retourne l'Etudiant bénéficiaire de la réservation."""
        return self.reservant_pour or self.etudiant

    def get_details(self):
        """Chaîne descriptive de la réservation."""
        return (
            f"Réservation #{self.id} — Bénéficiaire : {self.beneficiaire.matricule} | "
            f"Jour : {self.jour.nomJour} | Période : {self.periode.nomPeriode} | "
            f"Statut : {self.get_statut_display()}"
        )
