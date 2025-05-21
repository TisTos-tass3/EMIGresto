from django.db import models
from .utilisateur import Utilisateur


class Authentification(models.Model):
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)
    dernier_acces = models.DateTimeField(auto_now=True)
    token = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Session de {self.utilisateur.nom}"
    
    class Meta:
        db_table = 'authentification'

