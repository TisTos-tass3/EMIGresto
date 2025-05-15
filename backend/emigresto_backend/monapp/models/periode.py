from django.db import models

class Periode(models.Model):
    idPeriode = models.AutoField(db_column='idPeriode', primary_key=True)  # Field name made lowercase.
    nomPeriode = models.CharField(db_column='nomPeriode', max_length=10)  # Field name made lowercase.

    class Meta:
        db_table = 'periode'

