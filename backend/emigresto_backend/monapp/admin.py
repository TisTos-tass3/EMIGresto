from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    Utilisateur, Etudiant, ChefServiceRestaurant, Magasinier,
    VendeurTicket, ResponsableGuichet, Authentification, Notification, Paiement,
    Ticket, Transaction, RecuTicket, Reservation, Jour, Periode, Recharge
)

# 1. Personnalisation de l'administration pour le modèle Utilisateur
class UtilisateurAdmin(UserAdmin):
    # Champs à afficher dans la liste des utilisateurs
    list_display = ('email', 'nom', 'prenom', 'telephone', 'role', 'is_staff', 'is_active')
    # Champs sur lesquels on peut rechercher
    search_fields = ('email', 'nom', 'prenom', 'telephone')
    # Ordre de tri par défaut
    ordering = ('email',)
    # Filtres latéraux
    list_filter = ('role', 'is_staff', 'is_active')

    # Groupes de champs pour le formulaire d'édition d'un utilisateur existant
    fieldsets = (
        (None, {'fields': ('email', 'password')}), # L'email est le USERNAME_FIELD
        ('Informations Personnelles', {'fields': ('nom', 'prenom', 'telephone', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates Importantes', {'fields': ('last_login', 'date_joined')}),
    )

    # Groupes de champs pour le formulaire de création d'un nouvel utilisateur
    # Il est crucial d'inclure 'password' et 'password2' pour le hashing correct du mot de passe
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'password2'),
        }),
        ('Informations Personnelles', {'fields': ('nom', 'prenom', 'telephone', 'role')}),
    )

    # Supprime les filtres inutiles pour les utilisateurs personnalisés
    filter_horizontal = ()

# Enregistrement du modèle Utilisateur avec sa personnalisation
admin.site.register(Utilisateur, UtilisateurAdmin)

# 2. Personnalisation de l'administration pour le modèle Etudiant
# Nous allons utiliser une 'Inline' pour que les champs d'Etudiant apparaissent
# directement lors de l'édition d'un Utilisateur de rôle 'ETUDIANT'.
# Cela est dû au fait que Etudiant hérite d'Utilisateur.
class EtudiantInline(admin.StackedInline):
    model = Etudiant
    can_delete = False # Empêche la suppression de l'étudiant via l'utilisateur parent
    verbose_name_plural = 'Détails Étudiant' # Nom affiché dans l'admin
    fk_name = 'utilisateur_ptr' # IMPORTANT : Indique la relation de clé étrangère
    fields = ('matricule', 'solde') # Champs spécifiques à l'étudiant à afficher

# Pour gérer les étudiants, vous pouvez choisir de les afficher dans la liste principale des Utilisateurs
# et de les modifier via l'inline, ou de créer une section "Étudiants" séparée.
# Voici une option pour une section "Étudiants" dédiée qui utilise l'inline.
class EtudiantAdmin(UtilisateurAdmin): # Hérite de UtilisateurAdmin pour les champs de base
    inlines = (EtudiantInline,) # Active l'affichage des champs d'Etudiant dans le formulaire Utilisateur

    # On peut surcharger list_display pour inclure les champs spécifiques à Etudiant
    list_display = ('email', 'nom', 'prenom', 'matricule', 'solde', 'is_staff', 'is_active')

    # Filtrer le queryset pour n'afficher que les utilisateurs ayant le rôle "ETUDIANT"
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(role='ETUDIANT')

    # Cache les champs liés à l'utilisateur standard si l'inline suffit
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informations Personnelles', {'fields': ('nom', 'prenom', 'telephone', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    # Laissez add_fieldsets comme dans UtilisateurAdmin ou adaptez si nécessaire
    # Les champs spécifiques à Etudiant seront gérés par l'inline.

# Enregistrement du modèle Etudiant séparément pour avoir une entrée "Étudiants" dans l'admin
admin.site.register(Etudiant, EtudiantAdmin)


# Enregistrement des autres modèles
admin.site.register(Recharge)
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


# Personnalisation des titres de l'interface d'administration
admin.site.site_header = "Administration EMIGResto"
admin.site.site_title = "Portail Admin EMIGResto"
admin.site.index_title = "Bienvenue dans l'administration EMIGResto"