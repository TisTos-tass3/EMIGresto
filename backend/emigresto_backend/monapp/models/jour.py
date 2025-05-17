from django.db import models
from django.utils import timezone

class Jour(models.Model):
    id       = models.AutoField(primary_key=True, db_column='id')
    nomJour  = models.CharField(db_column='nomJour', max_length=10)

    @property
    def get_nomJour(self):
        return self.nomJour

    @property
    def get_nbre_reserve_jour(self):
        from .reservations import Reservation
        # on filtre bien sur le champ "jour", pas "Jour" ni "idJour"
        return Reservation.objects.filter(jour=self).count()

    def get_nbre_reserve_lendemain(self, periode_id):
        from .periode import Periode
        from .reservations import Reservation

        try:
            periode = Periode.objects.get(id=periode_id)
        except Periode.DoesNotExist:
            return 0

        lendemain = timezone.localdate() + timezone.timedelta(days=1)
        # on utilise les bons noms de champs : "date", "jour" et "periode"
        return Reservation.objects.filter(
            date=lendemain,
            jour=self,
            periode=periode
        ).count()

    class Meta:
        db_table = 'jour'
