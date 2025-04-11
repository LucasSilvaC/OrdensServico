from .models import OrdemServico, Gestor, Manutentor, Patrimonio, Ambiente, Historico, UserComum, Area
from .serializers import OrdemServicoSerializer, GestoresSerializer, ManutentoresSerializer, AreaSerializer,PatrimonioSerializer, AmbienteSerializer, HistoricosSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
import os
from django.conf import settings
from django.contrib.auth import get_user_model

# Retorna o modelo de usuário atual que está utilizando
User = get_user_model()

#  ORDEM DE SERVIÇO 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_ordens(request):
    if request.method == 'GET':
        queryset = OrdemServico.objects.all()
        serializer = OrdemServicoSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = OrdemServicoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OrdensView(ListCreateAPIView):
    queryset = OrdemServico.objects.all()
    serializer_class = OrdemServicoSerializer
    permission_classes = [IsAuthenticated]

class OrdensDetailView(RetrieveUpdateDestroyAPIView):
    queryset = OrdemServico.objects.all()
    serializer_class = OrdemServicoSerializer
    permission_classes = [IsAuthenticated]

#  GESTORES 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_gestores(request):
    if request.method == 'GET':
        queryset = Gestor.objects.all()
        serializer = GestoresSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = GestoresSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GestoresView(ListCreateAPIView):
    queryset = Gestor.objects.all()
    serializer_class = GestoresSerializer
    permission_classes = [IsAuthenticated]

class GestoresDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Gestor.objects.all()
    serializer_class = GestoresSerializer
    permission_classes = [IsAuthenticated]

#  MANUTENTORES 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_manutentores(request):
    if request.method == 'GET':
        queryset = Manutentor.objects.all()
        serializer = ManutentoresSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ManutentoresSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ManutentoresView(ListCreateAPIView):
    queryset = Manutentor.objects.all()
    serializer_class = ManutentoresSerializer
    permission_classes = [IsAuthenticated]

class ManutentoresDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Manutentor.objects.all()
    serializer_class = ManutentoresSerializer
    permission_classes = [IsAuthenticated]

#  PATRIMÔNIO 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_patrimonios(request):
    if request.method == 'GET':
        queryset = Patrimonio.objects.all()
        serializer = PatrimonioSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PatrimonioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PatrimoniosView(ListCreateAPIView):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer
    permission_classes = [IsAuthenticated]

class PatrimoniosDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer
    permission_classes = [IsAuthenticated]

#  AMBIENTES 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_ambientes(request):
    if request.method == 'GET':
        queryset = Ambiente.objects.all()
        serializer = AmbienteSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AmbienteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AmbientesView(ListCreateAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [IsAuthenticated]

class AmbientesDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [IsAuthenticated]

#  HISTÓRICO 
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_historicos(request):
    if request.method == 'GET':
        queryset = Historico.objects.all()
        serializer = HistoricosSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = HistoricosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class HistoricosView(ListCreateAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricosSerializer
    permission_classes = [IsAuthenticated]

class HistoricosDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricosSerializer
    permission_classes = [IsAuthenticated]

#  CADASTRO DE USUÁRIO 
class CriarUsuarioComumAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'erro': 'Usuário e senha são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'erro': 'Usuário já existe'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return Response({
            'mensagem': 'Usuário comum criado com sucesso!',
            'access_token': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)

class CriarFuncionarioStaffAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'erro': 'Usuário e senha são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password, is_staff=True)
        refresh = RefreshToken.for_user(user)
        return Response({
            'mensagem': 'Funcionário (staff) criado com sucesso!',
            'access_token': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)

class CriarSuperUsuarioAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'erro': 'Usuário e senha são obrigatórios'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_superuser(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return Response({
            'mensagem': 'Superusuário criado com sucesso!',
            'access_token': str(refresh.access_token)
        }, status=status.HTTP_201_CREATED)
    

#  AREA
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_areas(request):
    if request.method == 'GET':
        queryset = Area.objects.all()
        serializer = AreaSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AreaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AreasView(ListCreateAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [IsAuthenticated]

class AreasDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [IsAuthenticated]