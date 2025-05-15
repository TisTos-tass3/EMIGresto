from rest_framework import serializers
from ..models.notification import Notification

class NotificationSerializer(serializers.ModelSerializer):
    utilisateur = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Notification
        fields = ['idNotification', 'dateEnvoi', 'contenu', 'typeNotification', 'utilisateur']
        read_only_fields = ['idNotification', 'dateEnvoi', 'utilisateur']
