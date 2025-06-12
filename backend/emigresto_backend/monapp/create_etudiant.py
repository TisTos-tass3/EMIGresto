# create_etudiants.py
from django.utils import timezone
from restoapp.models import Etudiant

etudiants_data = [
    {"email": "alice@example.com", "nom": "Alice", "prenom": "Koumba", "matricule": "EM2023001", "genre": "F"},
    {"email": "bob@example.com", "nom": "Bob", "prenom": "Issa", "matricule": "EM2023002", "genre": "M"},
    {"email": "carine@example.com", "nom": "Carine", "prenom": "Zara", "matricule": "EM2023003", "genre": "F"},
]

for data in etudiants_data:
    etu, created = Etudiant.objects.get_or_create(
        email=data["email"],
        defaults={
            "nom": data["nom"],
            "prenom": data["prenom"],
            "matricule": data["matricule"],
            "genre": data["genre"],
            "date_joined": timezone.now(),
        }
    )
    if created:
        etu.set_password("default1234")  # ⚠️ Change ce mot de passe plus tard
        etu.save()
        print(f"✅ Étudiant {etu.get_fullName} créé avec succès.")
    else:
        print(f"ℹ️ Étudiant {etu.get_fullName} existe déjà.")
