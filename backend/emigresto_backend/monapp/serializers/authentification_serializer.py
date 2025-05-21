from rest_framework import serializers
from ..models.authentification import Authentification

class AuthentificationSerializer(serializers.ModelSerializer):
    utilisateur = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Authentification
        fields = ['id', 'utilisateur', 'token', 'date_expiration']
        read_only_fields = ['id', 'token', 'date_expiration']
