from django.contrib import admin
from .models import (
    Utilisateur, Etudiant, ChefServiceRestaurant, Magasinier,
    VendeurTicket, ResponsableGuichet, Authentification, Notification, Paiement,
    Ticket, Transaction, RecuTicket, Reservation, Jour, Periode , Recharge
)

admin.site.register(Utilisateur)
admin.site.register(Etudiant)
admin.site.register(Recharge)
#admin.site.register(Administrateur)
admin.site.register(ChefServiceRestaurant)
admin.site.register(Magasinier)
admin.site.register(VendeurTicket)
admin.site.register(ResponsableGuichet)
admin.site.register(Authentification)
admin.site.register(Notification)
admin.site.register(Paiement)
admin.site.register(Ticket)
admin.site.register(Transaction)
admin.site.register(RecuTicket)
admin.site.register(Reservation)
admin.site.register(Jour)
admin.site.register(Periode)