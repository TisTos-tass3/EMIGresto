from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    auth_views, etudiant_views, jour_views, notification_views,
    paiement_views, personnel_views, recu_views,
    reservation_views, ticket_views, transaction_views,
    utilisateur_views,
)

router = DefaultRouter()
viewsets = [
    ('etudiants',       etudiant_views.EtudiantViewSet),
    ('jours',           jour_views.JourViewSet),
    ('reservations',    reservation_views.ReservationViewSet),
    ('tickets',         ticket_views.TicketViewSet),
    ('utilisateurs',    utilisateur_views.UtilisateurViewSet),
    ('personnels',      personnel_views.ResponsableGuichetViewSet),
    ('notifications',   notification_views.NotificationViewSet),
    ('transactions',    transaction_views.TransactionViewSet),
    ('recus',           recu_views.RecuTicketViewSet),
    ('paiements',       paiement_views.PaiementViewSet),
    #('authentifications', auth_views.RegisterView, 'authentification'),
]

for item in viewsets:
    if len(item) == 2:
        prefix, viewset = item
        router.register(prefix, viewset)
    else:
        prefix, viewset, basename = item
        router.register(prefix, viewset, basename=basename)

urlpatterns = [
    path('api/', include(router.urls)),

    # Auth custom
    path('api/auth/register/', auth_views.RegisterView.as_view(), name='auth-register'),
    path('api/auth/logout/',   auth_views.LogoutView.as_view(),   name='auth-logout'),

    # JWT endpoints
    path('api/auth/token/',   auth_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', auth_views.TokenRefreshView.as_view(), name='token_refresh'),
]
