from django.db import models
from .utilisateur import Utilisateur

class Notification(models.Model):
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    message = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification à {self.utilisateur.nom}"
    
    class Meta:
        db_table = 'notification'


