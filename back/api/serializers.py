from rest_framework import serializers
from .models import OrdemServico, Patrimonio, Ambiente, Manutentor, Gestor, Area, UserComum
from django.contrib.auth.hashers import make_password

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

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class GestoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gestor
        fields = '__all__'

class ManutentoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manutentor
        fields = '__all__'

class OrdemServicoSerializer(serializers.ModelSerializer):
    ambiente = serializers.PrimaryKeyRelatedField(queryset=Ambiente.objects.all())
    abertura = serializers.DateTimeField(required=False)

    class Meta:
        model = OrdemServico
        fields = '__all__'
        depth = 1

    def validate_sn(self, value):
        if OrdemServico.objects.filter(sn=value).exists():
            raise serializers.ValidationError(f"Já existe uma ordem de serviço com o SN: {value}")
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserComum
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = UserComum(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep.pop('password', None)
        return rep