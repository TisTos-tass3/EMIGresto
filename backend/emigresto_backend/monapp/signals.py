# Dans signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Utilisateur, Etudiant

@receiver(post_save, sender=Utilisateur)
def create_etudiant(sender, instance, created, **kwargs):
    """
    Crée automatiquement un profil étudiant pour les nouveaux utilisateurs
    avec le rôle ETUDIANT.
    """
    if created and instance.role == 'ETUDIANT':
        # Génération automatique du matricule
        matricule = f"ETU{instance.id:06d}"

        # Création de l'étudiant
        Etudiant.objects.create(
            utilisateur=instance,
            matricule=matricule,
            solde=0,
            genre='M'  # Valeur par défaut
        )
