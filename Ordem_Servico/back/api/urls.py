from django.urls import path
from .views import listar_ambientes, listar_ordens, listar_gestores, listar_historicos, listar_manutentores, listar_patrimonios, listar_responsaveis, register, delete_file
from .views import AmbientesDetailView, OrdensDetailView, GestoresDetailView, HistoricosDetailView, ManutentoresDetailView, PatrimoniosDetailView, ResponsaveisDetailView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    #Listar
    path('ambientes', listar_ambientes), 
    path('ordens', listar_ordens),
    path('gestores', listar_gestores),
    path('historicos', listar_historicos),
    path('manutentores', listar_manutentores),
    path('patrimonios', listar_patrimonios),
    path('responsaveis', listar_responsaveis),
    #DetailView
    path('ambiente/<int:pk>', AmbientesDetailView.as_view()),
    path('ordem/<int:pk>', OrdensDetailView.as_view()),
    path('gestor/<int:pk>', GestoresDetailView.as_view()),
    path('historicos/<int:pk>', HistoricosDetailView.as_view()),
    path('manutentor/<int:pk>', ManutentoresDetailView.as_view()),
    path('patrimonio/<int:pk>', PatrimoniosDetailView.as_view()),
    path('responsavel/<int:pk>', ResponsaveisDetailView.as_view()), 
    #Administrador
    path('register/', register), 
    #Delete file
    path('delete_file/<str:filename>', delete_file),
    #Token
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh')
]