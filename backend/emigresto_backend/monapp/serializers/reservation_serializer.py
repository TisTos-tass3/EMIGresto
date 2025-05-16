from rest_framework import serializers
from ..models.reservations import Reservation
from ..models.jour import Jour
from ..models.periode import Periode
from .etudiant_serializer import EtudiantSerializer
from .jour_serializer import JourSerializer
from .periode_serializer import PeriodeSerializer


class ReservationSerializer(serializers.ModelSerializer):
    etudiant        = EtudiantSerializer(read_only=True)
    reservant_pour  = EtudiantSerializer(read_only=True)
    jour            = JourSerializer(read_only=True)
    periode         = PeriodeSerializer(read_only=True)
    beneficiaire    = serializers.SerializerMethodField()
    details         = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = [
            'id', 'date', 'heure', 'statut',
            'etudiant', 'reservant_pour',
            'jour', 'periode',
            'beneficiaire', 'details'
        ]
        read_only_fields = ['id', 'statut', 'beneficiaire', 'details']

    def get_beneficiaire(self, obj):
        return EtudiantSerializer(obj.beneficiaire).data

    def get_details(self, obj):
        return obj.get_details()


class ReservationCreateSerializer(serializers.ModelSerializer):
    # on reçoit les PK, pas les objets nested
    jour            = serializers.PrimaryKeyRelatedField(queryset=Jour.objects.all())
    periode         = serializers.PrimaryKeyRelatedField(queryset=Periode.objects.all())
    reservant_pour  = serializers.PrimaryKeyRelatedField(
        queryset=Reservation._meta.get_field('reservant_pour').related_model.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Reservation
        fields = ['jour', 'periode', 'date', 'heure', 'reservant_pour']

    def validate(self, attrs):
        user = self.context['request'].user
        reservant = attrs.get('reservant_pour') or user
        if Reservation.objects.filter(
            reservant_pour=reservant,
            jour=attrs['jour'],
            periode=attrs['periode'],
            date=attrs.get('date')
        ).exists():
            raise serializers.ValidationError("Double réservation pour ce créneau.")
        return attrs
