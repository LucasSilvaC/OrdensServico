from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class OrdemServico(models.Model):
    Status_OrdemServico = [
        ('INI', 'Iniciada'),
        ('AND', 'Em Andamento'),
        ('FIN', 'Finalizada'),
        ('CAN', 'Cancelada'),
    ]
    Prioridade_OrdemServico = [
        ('A', 'Alta'),
        ('M', 'Média'),
        ('B', 'Baixa'),
    ]
    
    descricao = models.CharField(max_length=255)
    abertura = models.DateTimeField(auto_now_add=True)
    fechamento = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=3, choices=Status_OrdemServico)
    patrimonio = models.ForeignKey('Patrimonio', on_delete=models.SET_NULL, null=True, blank=True)
    ambiente = models.ForeignKey('Ambiente', on_delete=models.CASCADE)
    manutentor = models.ForeignKey('Manutentor', on_delete=models.CASCADE)
    responsavel = models.ForeignKey('Responsavel', on_delete=models.SET_NULL, null=True, blank=True)
    prioridade = models.CharField(max_length=1, choices=Prioridade_OrdemServico)

class Patrimonio(models.Model):
    ni = models.CharField(max_length=255, unique=True)
    descricao = models.CharField(max_length=255)
    localizacao = models.ForeignKey('Ambiente', on_delete=models.CASCADE)
    media = models.ImageField(upload_to='media/', blank=True, null=True)

class Ambiente(models.Model):
    ni = models.CharField(max_length=50, unique=True)
    nome = models.CharField(max_length=255)

class Manutentor(models.Model):
    ni = models.CharField(max_length=50, unique=True)
    nome = models.CharField(max_length=255)
    area = models.CharField(max_length=255)
    gestor = models.ForeignKey('Gestor', on_delete=models.CASCADE)

class Responsavel(models.Model):
    ni = models.CharField(max_length=50, unique=True)
    nome = models.CharField(max_length=255)

class Gestor(models.Model):
    Cargo_Gestor = [
        ('Diretor', 'Diretor'),
        ('Coordenador Pedagógico', 'Coordenador Pedagógico'),
        ('Coordenador Técnico', 'Coordenador Técnico'),
        ('Orientador de práticas profissionais', 'Orientador de práticas profissionais'),
    ]
       
    ni = models.CharField(max_length=50, unique=True)
    nome = models.CharField(max_length=255)
    area = models.CharField(max_length=255)
    cargo = models.CharField(max_length=36, choices=Cargo_Gestor)

class Historico(models.Model):
    ordem_servico = models.ForeignKey('OrdemServico', on_delete=models.CASCADE)
    atividade_realizada = models.TextField()

class AdministradorManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('O usuário deve ter um nome de usuário.')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)

class Administrador(AbstractUser):
    objects = AdministradorManager()