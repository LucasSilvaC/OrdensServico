from rest_framework import serializers
from .models import OrdemServico, Patrimonio, Ambiente, Manutentor, Responsavel, Gestor, Historico, Administrador
from django.contrib.auth.hashers import make_password

class OrdemServicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdemServico
        fields = '__all__'

class AmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiente
        fields = '__all__'
        
class PatrimonioSerializer(serializers.ModelSerializer):
    localizacao_obj = AmbienteSerializer(source='localizacao', read_only=True)
    localizacao = serializers.PrimaryKeyRelatedField(queryset=Ambiente.objects.all())

    class Meta:
        model = Patrimonio
        fields = ['id', 'ni', 'descricao', 'localizacao', 'media', 'localizacao_obj']

class ManutentoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manutentor
        fields = '__all__'

class ResponsaveisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsavel
        fields = '__all__'

class GestoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gestor
        fields = '__all__'

class HistoricosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historico
        fields = '__all__'

class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = '__all__'

    def create(self, validated_data):
        password = validated_data.pop('password', None)  
        if password:
            validated_data['password'] = make_password(password)  
        user = Administrador.objects.create(**validated_data)
        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation.pop('password', None)  
        return representation                                