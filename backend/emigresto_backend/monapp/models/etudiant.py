from django.db import models
from .utilisateur import Utilisateur

class Etudiant(Utilisateur):
    matricule = models.CharField(max_length=20, unique=True)
    telephone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        verbose_name = "Étudiant"
        db_table = 'etudiant'

    def reserver_repas(self, repas, date, heure):
        from .reservations import Reservation
        return Reservation.objects.create(etudiant=self, repas=repas, date=date, heure=heure)

    def annuler_reservation(self, reservation_id):
        from .reservations import Reservation
        Reservation.objects.filter(id=reservation_id, etudiant=self).delete()

    def consulter_historique(self):
        return self.reservations.all()

    def payer_ticket(self, montant):
        from .paiement import Paiement
        return Paiement.objects.create(etudiant=self, montant=montant, mode_paiement='solde')

    @property
    def get_fullName(self):
        return f"{self.nom} {self.prenom}"
    
    # Improve reservation check method
    def existe_reserv_pour_periode_date(self, periode, date=None):
        from .reservations import Reservation
        from datetime import date as today_date
        check_date = date or today_date.today()
        return Reservation.objects.filter(
            idEtudiant=self,
            idPeriode=periode,
            dateReservation=check_date
        ).exists()
    
        
