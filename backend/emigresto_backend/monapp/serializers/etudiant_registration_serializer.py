# monapp/serializers/etudiant_registration_serializer.py

from rest_framework import serializers
from ..models import Etudiant, Utilisateur # Import both models

class EtudiantRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for registering a new Etudiant.
    Handles fields from both the Utilisateur parent model and the Etudiant child model.
    """
    # Fields inherited from Utilisateur (the parent model)
    email = serializers.EmailField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)
    nom = serializers.CharField(max_length=50, required=True)
    prenom = serializers.CharField(max_length=50, required=True)
    telephone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    # Fields specific to Etudiant (the child model)
    matricule = serializers.CharField(max_length=20, required=True)
    sexe = serializers.CharField(max_length=1, required=True)

    # The 'role' field is implicitly 'ETUDIANT' for this serializer,
    # so we make it read-only and provide a default.
    role = serializers.CharField(max_length=30, read_only=True, default="ETUDIANT")

    class Meta:
        model = Etudiant # This serializer is explicitly tied to the Etudiant model
        fields = (
            'id', 'email', 'password', 'nom', 'prenom', 'telephone',
            'matricule', 'sexe', 'role'
        )
        extra_kwargs = {
            'password': {'write_only': True} # Password should not be readable after creation
        }

    def create(self, validated_data):
        """
        Custom create method to handle multi-table inheritance.
        Creating an Etudiant instance automatically creates its Utilisateur parent.
        """
        # Pop fields that belong to the Utilisateur parent from validated_data
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        nom = validated_data.pop('nom')
        prenom = validated_data.pop('prenom')
        telephone = validated_data.pop('telephone', '') # Handle optional telephone

        # Pop fields specific to Etudiant
        matricule = validated_data.pop('matricule')
        sexe = validated_data.pop('sexe')

        # Create the Etudiant instance.
        # Because Etudiant inherits from Utilisateur, this single creation
        # will automatically create the corresponding Utilisateur entry first,
        # then the Etudiant entry linked by the same ID.
        etudiant = Etudiant(
            email=email,
            nom=nom,
            prenom=prenom,
            telephone=telephone,
            role="ETUDIANT", # Ensure the role is set correctly
            matricule=matricule,
            sexe=sexe,
            # Any remaining validated_data fields would go here if applicable
            **validated_data
        )
        etudiant.set_password(password) # Hash the password for security
        etudiant.save() # Save the Etudiant, which also saves the Utilisateur parent

        return etudiant

    def update(self, instance, validated_data):
        """
        Update method (optional, implement if you need to update Etudiant profiles)
        """
        # Update Utilisateur fields
        instance.email = validated_data.get('email', instance.email)
        instance.nom = validated_data.get('nom', instance.nom)
        instance.prenom = validated_data.get('prenom', instance.prenom)
        instance.telephone = validated_data.get('telephone', instance.telephone)

        # Update Etudiant specific fields
        instance.matricule = validated_data.get('matricule', instance.matricule)
        instance.sexe = validated_data.get('sexe', instance.sexe)

        # Handle password update if provided
        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance