from django.db import models
from .utilisateur import Utilisateur

class PersonnelRestaurant(Utilisateur):
    class Meta:
        abstract = True


class Administrateur(PersonnelRestaurant):
    def gerer_utilisateurs(self):
        pass

    def configurer_systeme(self):
        pass

    def generer_rapports(self):
        pass


class ChefServiceRestaurant(PersonnelRestaurant):
    def superviser_activites(self):
        pass

    def valider_rapport(self):
        pass

    def creer_repas(self):
        pass


class Magasinier(PersonnelRestaurant):
    def mettre_a_jour_stock(self):
        pass

    def generer_alerte_seuil(self):
        pass

    def recevoir_commande(self):
        pass


class VendeurTicket(PersonnelRestaurant):
    def vendre_ticket(self):
        pass

    def generer_qr_code(self):
        pass

    def enregistrer_vente(self):
        pass


class ResponsableGuichet(PersonnelRestaurant):
    def verifier_reservations(self):
        pass

    def valider_acces_repas(self):
        pass
