# emigresto/models/ticketissue.py
from django.db import models
from django.utils import timezone
from .etudiant import Etudiant
from .paiement import Paiement

class TicketIssueEvent(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name="issues")
    paiement = models.OneToOneField(Paiement, on_delete=models.PROTECT, related_name="issue_event")
    quantity = models.PositiveIntegerField()
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "ticket_issue_event"
        ordering = ["-timestamp"]

    def __str__(self):
        return f"Issue {self.id}: {self.quantity} tickets → {self.etudiant.matricule}"

