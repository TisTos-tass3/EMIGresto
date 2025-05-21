from rest_framework import serializers
from ..models.personnel import PersonnelRestaurant, ChefServiceRestaurant, Magasinier, VendeurTicket, ResponsableGuichet

class PersonnelBaseSerializer(serializers.ModelSerializer):
    utilisateur = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = PersonnelRestaurant
        fields = ['idPersonnel', 'utilisateur', 'role']
        read_only_fields = ['idPersonnel', 'utilisateur', 'role']

class ChefServiceSerializer(PersonnelBaseSerializer):
    class Meta(PersonnelBaseSerializer.Meta):
        model = ChefServiceRestaurant

class MagasinierSerializer(PersonnelBaseSerializer):
    class Meta(PersonnelBaseSerializer.Meta):
        model = Magasinier

class VendeurTicketsSerializer(PersonnelBaseSerializer):
    class Meta(PersonnelBaseSerializer.Meta):
        model = VendeurTicket

class ResponsableGuichetSerializer(PersonnelBaseSerializer):
    class Meta(PersonnelBaseSerializer.Meta):
        model = ResponsableGuichet
