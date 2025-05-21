# monapp/views/auth_views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.contrib.auth import get_user_model
from ..serializers.utilisateur_serializer import UtilisateurSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        POST /api/auth/register/
        {
          "email": "...",
          "password": "...",
          "nom": "...",
          "prenom": "...",
          "telephone": "..."   # facultatif
        }
        """
        serializer = UtilisateurSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {'email': user.email, 'user_id': user.id},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    POST /api/auth/token/
    {
      "email": "...",
      "password": "..."
    }
    => { access, refresh }
    """
    permission_classes = [AllowAny]

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
        """
        POST /api/auth/logout/
        { "refresh": "<token>" }
        """
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
