# monapp/serializers/token_serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from ..models import Etudiant  # Assurez-vous que ce chemin est correct

Utilisateur = get_user_model()  # Récupère le modèle utilisateur personnalisé

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    email = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'username' in self.fields:
            self.fields.pop('username')

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Ajout de claims personnalisés dans le token
        token['user_id'] = user.id
        token['prenom'] = user.prenom
        token['role'] = user.role

        if user.role == "ETUDIANT":
            try:
                etudiant = Etudiant.objects.get(id=user.id)
                token['matricule'] = etudiant.matricule
                token['solde'] = float(etudiant.solde)
            except Etudiant.DoesNotExist:
                token['matricule'] = None
                token['solde'] = 0.0
        else:
            token['matricule'] = None
            token['solde'] = 0.0

        return token

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            user = Utilisateur.objects.get(email=email)
        except Utilisateur.DoesNotExist:
            raise serializers.ValidationError(
                'Aucun compte trouvé avec cet e-mail.',
                code='no_active_account'
            )

        if not user.is_active:
            raise serializers.ValidationError(
                'Le compte utilisateur est inactif.',
                code='inactive_account'
            )

        authenticated_user = authenticate(
            request=self.context.get('request'),
            username=user.email,
            password=password
        )

        if not authenticated_user:
            raise serializers.ValidationError(
                'Mot de passe incorrect.',
                code='incorrect_password'
            )

        self.user = authenticated_user
        return super().validate(attrs)
