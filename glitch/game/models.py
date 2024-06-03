from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class Cursussen(models.Model):
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)

class Modules(models.Model):
    cursus = models.ForeignKey(Cursussen, on_delete=models.CASCADE)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)


class HoofdOpdrachten(models.Model):
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)


class PuntenUitdagingen(models.Model):
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    benodige_punten = models.IntegerField()


class ConceptOpdracht(models.Model):
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)

    class Meta:
        db_table = 'game_conceptopdracht'

class Activiteiten(models.Model):
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)


class Niveaus(models.Model):
    activiteit = models.ForeignKey(Activiteiten, on_delete=models.CASCADE)
    beschrijving = models.CharField(max_length=640, blank=True)


class User(AbstractUser):
    username = models.CharField(max_length=64, unique=True)
    password = models.CharField(max_length=64)
    is_teacher = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    ingschr_cursus = models.ManyToManyField(
        Cursussen,
        through='IngschrCursus',
        blank=True
    )
    voortgang_hoofd_opdracht = models.ManyToManyField(
        HoofdOpdrachten,
        through='VoortgangHoofdOpdrachten',
        blank=True,
    )
    voortgang_concept_opdracht = models.ManyToManyField(
        ConceptOpdracht,
        through='VoortgangConceptOpdrachten',
        blank=True,
    )
    voortgang_punten_uitdaging = models.ManyToManyField(
        PuntenUitdagingen,
        through='VoortgangPuntenUitdaging',
        blank=True,
    )
    voortgang_activiteit_niveaus = models.ManyToManyField(
        Niveaus,
        through='VoortgangActiviteitenNiveaus',
        blank=True,
    )
    groups = models.ManyToManyField(
        Group,
        verbose_name="groups",
        related_name="user_groups",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name="user permissions",
        related_name="user_user_permissions",
        blank=True,
    )

class TeacherCursus(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cursus = models.ForeignKey(Cursussen, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'cursus')

class VoortgangHoofdOpdrachten(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    hoofd_opdracht = models.ForeignKey(
        HoofdOpdrachten,
        on_delete=models.DO_NOTHING
    )
    voortgang = models.BooleanField(default=False)


class VoortgangConceptOpdrachten(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    concept_opdracht = models.ForeignKey(
        ConceptOpdracht,
        on_delete=models.DO_NOTHING,
        null=True
    )
    voortgang = models.BooleanField(default=False)


class VoortgangPuntenUitdaging(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    punten_uitdaging = models.ForeignKey(
        PuntenUitdagingen,
        on_delete=models.DO_NOTHING,
        null=True
    )
    voortgang = models.BooleanField(default=False)


class VoortgangActiviteitenNiveaus(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    niveau = models.ForeignKey(Niveaus, on_delete=models.DO_NOTHING, null=True)
    voortgang = models.IntegerField(default=0)


class IngschrCursus(models.Model):
    student = models.ForeignKey(User, models.DO_NOTHING, db_column='user_id')
    cursus = models.ForeignKey(Cursussen, models.DO_NOTHING, db_column='cursussen_id')
    voortgang = models.IntegerField(default=0)

    class Meta: 
        managed = False
        db_table = 'game_user_ingschr_cursus'
        unique_together = (('student', 'cursus'),)