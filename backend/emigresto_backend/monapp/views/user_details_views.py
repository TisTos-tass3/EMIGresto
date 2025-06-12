from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
# from django.shortcuts import get_object_or_404 # No longer strictly needed if not querying other models
# from ..models import Etudiant, Ticket # Remove Etudiant if not used, keep Ticket if relevant elsewhere

class UserDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user # This 'user' object is already your authenticated Utilisateur instance

        # Check if the user object is valid (though IsAuthenticated usually handles this)
        if not user.is_authenticated:
            return Response(
                {"detail": "Authentification requise."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Directly access fields from the Utilisateur model
        data = {
            "id": user.id,
            "email": user.email,
            "prenom": user.first_name if hasattr(user, 'first_name') else user.prenom, # Adjust 'first_name' to your actual prenom field name on Utilisateur
            "nom": user.last_name if hasattr(user, 'last_name') else user.nom, # Adjust 'last_name' to your actual nom field name on Utilisateur
            # If your Utilisateur model has a 'solde' field, you can add it here:
             "solde": float(user.solde) if hasattr(user, 'solde') else 0.0,
            # If you have tickets directly linked to Utilisateur, you can count them here:
             "nombre_tickets": user.tickets.count() if hasattr(user, 'tickets') else 0,
            # Add any other fields from your Utilisateur model that you need
        }

        return Response(data, status=status.HTTP_200_OK)

    # You can remove the try-except Etudiant.DoesNotExist block as it's no longer relevant
    # You might want to keep a general exception handler for unexpected server errors:
    # except Exception as e:
    #     return Response(
    #         {"detail": f"Une erreur inattendue est survenue: {str(e)}"},
    #         status=status.HTTP_500_INTERNAL_SERVER_ERROR
    #     )