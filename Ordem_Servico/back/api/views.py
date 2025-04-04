from .models import OrdemServico, Gestor, Manutentor, Patrimonio, Ambiente, Responsavel, Historico, Administrador
from .serializers import OrdemServicoSerializer, GestoresSerializer, ManutentoresSerializer, PatrimonioSerializer, AmbienteSerializer, ResponsaveisSerializer, HistoricosSerializer, AdministradorSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
import os
from django.conf import settings

# CHAMADOS
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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrdensView(ListCreateAPIView):
    queryset = OrdemServico.objects.all()
    serializer_class = OrdemServicoSerializer
    permission_classes = [IsAuthenticated]  

class OrdensDetailView(RetrieveUpdateDestroyAPIView):
    queryset = OrdemServico.objects.all()
    serializer_class = OrdemServicoSerializer
    permission_classes = [IsAuthenticated]

# GESTORES
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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class GestoresView(ListCreateAPIView):
    queryset = Gestor.objects.all()
    serializer_class = GestoresSerializer
    permission_classes = [IsAuthenticated]

class GestoresDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Gestor.objects.all()
    serializer_class = GestoresSerializer
    permission_classes = [IsAuthenticated]    

# MANUTENTORES
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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ManutentoresView(ListCreateAPIView):
    queryset = Manutentor.objects.all()
    serializer_class = ManutentoresSerializer
    permission_classes = [IsAuthenticated]

class ManutentoresDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Manutentor.objects.all()
    serializer_class = ManutentoresSerializer
    permission_classes = [IsAuthenticated]            

# PATRIMONIOS
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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class PatrimoniosView(ListCreateAPIView):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer
    permission_classes = [IsAuthenticated]

class PatrimoniosDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Patrimonio.objects.all()
    serializer_class = PatrimonioSerializer
    permission_classes = [IsAuthenticated]

# AMBIENTES  
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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class AmbientesView(ListCreateAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [IsAuthenticated]

class AmbientesDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [IsAuthenticated]            

# RESPONSAVEIS
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def listar_responsaveis(request):
    if request.method == 'GET':
        queryset = Responsavel.objects.all()
        serializer = ResponsaveisSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ResponsaveisSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ResponsaveisView(ListCreateAPIView):
    queryset = Responsavel.objects.all()
    serializer_class = ResponsaveisSerializer
    permission_classes = [IsAuthenticated]

class ResponsaveisDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Responsavel.objects.all()
    serializer_class = ResponsaveisSerializer
    permission_classes = [IsAuthenticated]            

# HISTORICOS   
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
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HistoricosView(ListCreateAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricosSerializer
    permission_classes = [IsAuthenticated]

class HistoricosDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Historico.objects.all()
    serializer_class = HistoricosSerializer
    permission_classes = [IsAuthenticated]                

# ADMINISTRADOR
@api_view(['POST'])
def register(request):
    serializer = AdministradorSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        response_data = {
            "id": user.id,
            "username": user.username,
            "access_token": access_token
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DELETE FOTO
@api_view(['Delete'])
@permission_classes([IsAuthenticated])
def delete_file(filename):
    file_path = os.path.join(settings.MEDIA_ROOT, "fotos", filename)

    if os.path.exists(file_path):
        os.remove(file_path)
        return Response({"message":"Arquivo excluído com sucesso!"})
    else:
        return Response({"message":"Arquivo não encontrado!"}, status=404)