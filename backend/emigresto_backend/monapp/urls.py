# monapp/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    auth_views,
    etudiant_views,
    jour_views,
    periode_views,
    reservation_views,
    ticket_views,
    transaction_views,
    paiement_views,
    recu_views,
    personnel_views,
    notification_views,
    utilisateur_views,
    recharge_views,
    user_details_views,
)

router = DefaultRouter()

# Liste des tuples (prefix, ViewSet, optional basename)
viewsets = [
    ('recharges',    recharge_views.RechargeViewSet,        'recharge'),
    ('etudiants',    etudiant_views.EtudiantViewSet,        'etudiant'),
    ('jours',        jour_views.JourViewSet,                'jour'),
    ('periodes',     periode_views.PeriodeViewSet,          'periode'),
    ('reservations', reservation_views.ReservationViewSet,  'reservation'),
    ('tickets',      ticket_views.TicketViewSet,            'ticket'),
    ('transactions', transaction_views.TransactionViewSet,  'transaction'),
    ('paiements',    paiement_views.PaiementViewSet,        'paiement'),
    ('recus',        recu_views.RecuTicketViewSet,          'recu'),
    ('personnels',   personnel_views.ResponsableGuichetViewSet, 'personnel'),
    ('notifications',notification_views.NotificationViewSet,'notification'),
    ('utilisateurs', utilisateur_views.UtilisateurViewSet,  'utilisateur'),
]

for prefix, viewset, basename in viewsets:
    router.register(prefix, viewset, basename=basename)

urlpatterns = [
    # --- API CRUD ---
    path('api/', include(router.urls)),

    # --- Auth custom (Djoser / DRF) ---
    path('api/auth/register/', auth_views.RegisterView.as_view(),      name='auth-register'),
    path('api/auth/logout/',   auth_views.LogoutView.as_view(),        name='auth-logout'),

    # --- JWT endpoints via SimpleJWT ---
    path('api/auth/token/',      TokenObtainPairView.as_view(),       name='token_obtain_pair'),
    path('api/auth/me/',         auth_views.MeView.as_view(),         name='auth-me'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(),      name='token_refresh'),
     # Détail de l’utilisateur connecté
    path('api/user-details/', user_details_views.UserDetailsAPIView.as_view(), name='user-details'),
]
