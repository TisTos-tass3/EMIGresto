from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UtilisateurManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse e-mail est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Utilisateur(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, max_length=100)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    telephone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(
        max_length=30,
        choices=[
            ("ETUDIANT", "Étudiant"),
            ("ADMIN", "Administrateur"),
            ("CHEF_SERVICE", "Chef Service Restaurant"),
            ("MAGASINIER", "Magasinier"),
            ("VENDEUR_TICKETS", "Vendeur Tickets"),
            ("RESPONSABLE_GUICHET", "Responsable Guichet"),
            ("CUISINIER", "Cuisinier"),
        ],
        default="ETUDIANT"
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom']

    objects = UtilisateurManager()

   
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        db_table = 'utilisateur'


    def __str__(self):
        return f"{self.nom} {self.prenom} ({self.email})"

    def se_connecter(self):
        # Logique d'authentification personnalisée si besoin
        pass

    def se_deconnecter(self):
        # Logique de déconnexion personnalisée si besoin
        pass
