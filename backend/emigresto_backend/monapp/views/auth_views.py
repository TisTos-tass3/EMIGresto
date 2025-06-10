# monapp/views/auth_views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.contrib.auth import get_user_model
from ..serializers.utilisateur_serializer import UtilisateurSerializer
from ..serializers.token_serializers import CustomTokenObtainPairSerializer
from ..serializers.etudiant_registration_serializer import EtudiantRegistrationSerializer # NEW IMPORT


User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Get the role from the request data, defaulting to 'ETUDIANT' if not provided.
        # Convert to uppercase to match the choices defined in your Utilisateur model.
        role = request.data.get('role', 'ETUDIANT').upper()

        if role == 'ETUDIANT':
            # If the intended role is 'ETUDIANT', use the specialized serializer
            # that handles the creation of both Utilisateur and Etudiant entries.
            serializer = EtudiantRegistrationSerializer(data=request.data)
        else:
            # For all other roles (ADMIN, CHEF_SERVICE, etc.), use the generic
            # UtilisateurSerializer as these roles don't have linked child models
            # like Etudiant does.
            serializer = UtilisateurSerializer(data=request.data)

        # Validate the data. If validation fails, DRF's `raise_exception=True`
        # will automatically return a 400 Bad Request response with error details.
        serializer.is_valid(raise_exception=True)

        # Save the user. This will create either a full Etudiant profile (spanning
        # both tables) or just a Utilisateur profile, depending on the serializer used.
        user = serializer.save()

        # Return a success response, including the user's email, ID, and the role
        # that was successfully assigned.
        return Response(
            {
                'email': user.email,
                'user_id': user.id,
                'role': user.role, # Confirm the role that was saved
                'message': 'User registered successfully'
            },
            status=status.HTTP_201_CREATED
        )

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/auth/token/
    Utilise CustomTokenObtainPairSerializer pour gérer l'authentification par email/matricule
    et ajouter des claims personnalisés au token.
    """
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

class CustomTokenRefreshView(TokenRefreshView):
    """
    POST /api/auth/token/refresh/
    { "refresh": "<token>" }
    => { access }
    """
    permission_classes = [AllowAny]

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'detail': 'refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)