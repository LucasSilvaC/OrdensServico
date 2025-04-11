from django.urls import path
from .views import (
    listar_ambientes, listar_ordens, listar_gestores,
    listar_historicos, listar_manutentores, listar_patrimonios, listar_areas,
    AmbientesDetailView, OrdensDetailView, GestoresDetailView,
    HistoricosDetailView, ManutentoresDetailView, PatrimoniosDetailView,
    CriarUsuarioComumAPIView, CriarFuncionarioStaffAPIView, CriarSuperUsuarioAPIView, AreasDetailView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # Listar
    path('ambientes/', listar_ambientes),
    path('ordens/', listar_ordens),
    path('gestores/', listar_gestores),
    path('historicos/', listar_historicos),
    path('manutentores/', listar_manutentores),
    path('patrimonios/', listar_patrimonios),
    path('areas/', listar_areas),

    # DetailView
    path('ambiente/<int:pk>/', AmbientesDetailView.as_view()),
    path('ordem/<int:pk>/', OrdensDetailView.as_view()),
    path('gestor/<int:pk>/', GestoresDetailView.as_view()),
    path('historico/<int:pk>/', HistoricosDetailView.as_view()),
    path('manutentor/<int:pk>/', ManutentoresDetailView.as_view()),
    path('patrimonio/<int:pk>/', PatrimoniosDetailView.as_view()),
    path('area/<int:pk>/', AreasDetailView.as_view()),

    # Cadastro de usuários
    path('registrar/comum/', CriarUsuarioComumAPIView.as_view()),
    path('registrar/staff/', CriarFuncionarioStaffAPIView.as_view()),
    path('registrar/superuser/', CriarSuperUsuarioAPIView.as_view()),

    # Token JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]