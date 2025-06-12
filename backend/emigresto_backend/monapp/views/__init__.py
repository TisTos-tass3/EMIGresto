from .user_details_views import UserDetailsAPIView
from .auth_views import RegisterView
from .etudiant_views import EtudiantViewSet    
from .jour_views import JourViewSet
from .notification_views import NotificationViewSet
from .paiement_views import PaiementViewSet

from .personnel_views import ChefServiceRestaurantViewSet
from .personnel_views import MagasinierViewSet  
from .personnel_views import ResponsableGuichetViewSet  
from .recu_views import RecuTicketViewSet
from .reservation_views import ReservationViewSet
from .ticket_views import TicketViewSet
from .transaction_views import TransactionViewSet
from .utilisateur_views import UtilisateurViewSet
from .recharge_views import RechargeViewSet
from .base_viewset import BaseModelViewSet

