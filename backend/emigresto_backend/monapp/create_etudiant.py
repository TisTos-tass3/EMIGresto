import os
import sys
import django

# Ajoutez le chemin du projet au PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurez Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'emigresto_backend.settings')
django.setup()

from monapp.models import Utilisateur, Etudiant

def create_etudiants():
    count = 0

    users_without_etudiant = Utilisateur.objects.filter(
        role='ETUDIANT'
    ).exclude(
        id__in=Etudiant.objects.values_list('utilisateur_id', flat=True)
    )

    for user in users_without_etudiant:
        matricule = f"ETU{user.id:06d}"
        # Utilisez l'ID de l'utilisateur comme clé primaire
        etudiant = Etudiant(
            utilisateur_id=user.id,  # Utilisez l'ID directement
            matricule=matricule,
            solde=0,
            genre='M'
        )
        etudiant.save()
        count += 1

    print(f"Création de {count} profils étudiants")

if __name__ == '__main__':
    create_etudiants()
