from rest_framework import serializers
from ..models.notification import Notification

class NotificationSerializer(serializers.ModelSerializer):
    utilisateur = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'date_envoi', 'message', 'lu', 'utilisateur']
        read_only_fields = ['id', 'date_envoi', 'utilisateur']
