from rest_framework import viewsets
from ..models.notification import Notification
from ..serializers.notification_serializer import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

