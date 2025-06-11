from django.db import models
from django.utils import timezone
from .personnel import VendeurTicket 
  
class LotTicket(models.Model):
    TYPE_CHOICES = [
        ('PETIT', 'Petit-déjeuner'),
        ('DEJ',   'Déjeuner/Dîner'),
    ]

    id               = models.AutoField(primary_key=True)
    type_ticket      = models.CharField(max_length=5, choices=TYPE_CHOICES)
    vendeur          = models.ForeignKey(VendeurTicket, on_delete=models.PROTECT, related_name='lots')
    total_tickets    = models.PositiveIntegerField(
        default=14,
        help_text='Nombre total de tickets dans le lot (fixe à 14)'
    )
    tickets_restants = models.PositiveIntegerField(help_text='Tickets non vendus')
    prix_unitaire    = models.PositiveIntegerField(help_text='Prix unitaire par ticket', default=0)
    date_attribution = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'lot_ticket'
        ordering = ['-date_attribution']

    def save(self, *args, **kwargs):
        if not self.prix_unitaire:
            # Initialiser le prix par type
            self.prix_unitaire = 80 if self.type_ticket == 'PETIT' else 125
        if self._state.adding:
            # Chaque lot contient toujours 14 tickets
            self.tickets_restants = self.total_tickets
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Lot {self.id} ({self.get_type_ticket_display()})"