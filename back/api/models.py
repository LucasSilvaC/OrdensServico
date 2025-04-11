from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Áreas 
class Area(models.Model):
    nome = models.CharField(max_length=255)

# Gestores
class Gestor(models.Model):
    CARGO_GESTOR = [
        ('Diretor', 'Diretor'),
        ('Coordenador Pedagógico', 'Coordenador Pedagógico'),
        ('Coordenador Técnico', 'Coordenador Técnico'),
        ('Orientador de práticas profissionais', 'Orientador de práticas profissionais'),
    ]

    sn = models.CharField(max_length=255, unique=True)
    nome = models.CharField(max_length=255)
    cargo = models.CharField(max_length=50, choices=CARGO_GESTOR)

# Ambientes
class Ambiente(models.Model):
    sig = models.IntegerField(unique=True)
    descricao = models.CharField(max_length=255)
    ni = models.CharField(max_length=50, unique=True)
    responsavel = models.CharField(max_length=255)

# Patrimônio
class Patrimonio(models.Model):
    ni = models.CharField(max_length=255, unique=True)
    descricao = models.CharField(max_length=255)
    localizacao = models.ForeignKey('Ambiente', on_delete=models.CASCADE)
    media = models.ImageField(upload_to='media/', blank=True, null=True)

# Manutentores
class Manutentor(models.Model):
    sn = models.CharField(max_length=255, unique=True)
    nome = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    area = models.ForeignKey('Area', on_delete=models.CASCADE)
    gestor = models.ForeignKey('Gestor', on_delete=models.CASCADE)

# Ordem de Serviço
class OrdemServico(models.Model):
    STATUS = [
        ('INI', 'Iniciada'),
        ('AND', 'Em Andamento'),
        ('FIN', 'Finalizada'),
        ('CAN', 'Cancelada'),
    ]
    PRIORIDADE = [
        ('A', 'Alta'),
        ('M', 'Média'),
        ('B', 'Baixa'),
    ]

    descricao = models.CharField(max_length=255)
    abertura = models.DateTimeField(auto_now_add=True)
    fechamento = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=3, choices=STATUS)
    patrimonio = models.ForeignKey('Patrimonio', on_delete=models.SET_NULL, null=True, blank=True)
    ambiente = models.ForeignKey('Ambiente', on_delete=models.CASCADE)
    manutentor = models.ForeignKey('Manutentor', on_delete=models.CASCADE)
    responsavel = models.CharField(max_length=255, null=True, blank=True)
    prioridade = models.CharField(max_length=1, choices=PRIORIDADE)
    funcionario = models.ForeignKey('UserComum', on_delete=models.SET_NULL, null=True) 
    sn = models.CharField(max_length=255)  

# Histórico
class Historico(models.Model):
    ordem_servico = models.ForeignKey('OrdemServico', on_delete=models.CASCADE)
    atividade_realizada = models.TextField()

# Usuários
class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('O nome de usuário é obrigatório.')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class UserComum(AbstractUser):
    objects = UserManager()

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'    