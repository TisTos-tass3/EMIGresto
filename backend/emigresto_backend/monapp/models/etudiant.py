from django.db import models
from .utilisateur import Utilisateur

class Etudiant(Utilisateur):
    matricule = models.CharField(max_length=20, unique=True)
    solde       = models.DecimalField(
        max_digits=10, decimal_places=2,
        default=0,
        help_text="Solde du compte étudiant"
    )
    ticket_quota = models.PositiveIntegerField(default=0, help_text="Tickets numériques restants")
    GENRE_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    ]
    genre = models.CharField(
        max_length=2,
        choices=GENRE_CHOICES,
        blank=True,
        null=True,
        help_text="Genre de l'utilisateur"
    )

    class Meta:
        verbose_name = "Étudiant"
        db_table = 'etudiant'

    def reserver_repas(self, jour, periode, date, heure):
        from .reservations import Reservation
        return Reservation.objects.create(
            etudiant=self,
            jour=jour,
            periode=periode,
            date=date,
            heure=heure
        )

    def annuler_reservation(self, reservation_id):
        from .reservations import Reservation
        Reservation.objects.filter(id=reservation_id, etudiant=self).delete()

    def consulter_historique(self):
        return self.reservations_effectuees.all()

    def payer_ticket(self, montant):
        from .paiement import Paiement
        return Paiement.objects.create(
            etudiant=self,
            montant=montant,
            mode_paiement='solde'
        )

    @property
    def get_fullName(self):
        return f"{self.nom} {self.prenom}"

    def existe_reserv_pour_periode_date(self, periode, date=None):
        from .reservations import Reservation
        from datetime import date as today_date

        check_date = date or today_date.today()
        return Reservation.objects.filter(
            etudiant=self,
            periode=periode,
            date=check_date
        ).exists()
        
    def crediter(self, montant):
        """Ajoute `montant` au solde et sauvegarde."""
        if montant <= 0:
            raise ValueError("Le montant doit être positif.")
        self.solde = self.solde + montant
        self.save(update_fields=['solde'])
        return self.solde

    def debiter(self, montant):
        """Débite `montant` du solde si suffisant."""
        if montant <= 0:
            raise ValueError("Le montant doit être positif.")
        if montant > self.solde:
            raise ValueError("Solde insuffisant.")
        self.solde = self.solde - montant
        self.save(update_fields=['solde'])
        return self.solde

