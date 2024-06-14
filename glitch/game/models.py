from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser, Group, Permission

class Domeinen(models.Model):
    id = models.AutoField(editable=False, primary_key=True)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)


class Cursussen(models.Model):
    id = models.AutoField(editable=False, primary_key=True)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)
    domein = models.ForeignKey(Domeinen, on_delete=models.CASCADE)


class Modules(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    cursus = models.ForeignKey(Cursussen, on_delete=models.CASCADE)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)


class HoofdOpdrachten(models.Model):
    id = models.AutoField(editable=False, primary_key=True)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)


class PuntenUitdagingen(models.Model):
    id = models.AutoField(editable=False, primary_key=True)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    benodige_punten = models.IntegerField()


class ConceptOpdracht(models.Model):
    id = models.AutoField(editable=False, primary_key=True)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)

    class Meta:
        db_table = 'game_conceptopdracht'


class Activiteiten(models.Model):
    id = models.AutoField(editable=False, primary_key=True)
    module = models.ForeignKey(Modules, on_delete=models.CASCADE)
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640, blank=True)


class Niveaus(models.Model):
    id = models.AutoField(editable=False, primary_key=True)
    activiteit = models.ForeignKey(Activiteiten, on_delete=models.CASCADE)
    beschrijving = models.CharField(max_length=640, blank=True)


class User(AbstractUser):
    is_teacher = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    ingschr_cursus = models.ManyToManyField(
        Cursussen,
        through='IngschrCursus',
        blank=True
    )
    ingschr_domein = models.ManyToManyField(
        Domeinen,
        through='IngschrDomein',
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


# Voortgang codes:
# 0 nog niet gedaan
# 1 ingeleverd
# 2 goedgekeurd
# 3 afgekeurd       

class VoortgangHoofdOpdrachten(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    hoofd_opdracht = models.ForeignKey(
        HoofdOpdrachten,
        on_delete=models.DO_NOTHING
    )
    voortgang = models.IntegerField(default=0)
    ingeleverd_tekst = models.TextField(blank=True, null=True)

    def set_ingeleverd_tekst(self, tekst):
        self.ingeleverd_tekst = tekst
        self.save()

class VoortgangConceptOpdrachten(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    concept_opdracht = models.ForeignKey(
        ConceptOpdracht,
        on_delete=models.DO_NOTHING,
        null=True
    )
    voortgang = models.IntegerField(default=0)
    ingeleverd_tekst = models.TextField(blank=True, null=True)

    def set_ingeleverd_tekst(self, tekst):
        self.ingeleverd_tekst = tekst
        self.save()

class VoortgangPuntenUitdaging(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    punten_uitdaging = models.ForeignKey(
        PuntenUitdagingen,
        on_delete=models.DO_NOTHING,
        null=True
    )
    voortgang = models.IntegerField(default=0)

class VoortgangActiviteitenNiveaus(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    niveau = models.ForeignKey(Niveaus, on_delete=models.DO_NOTHING, null=True)
    voortgang = models.IntegerField(default=0)


class IngschrCursus(models.Model):
    student = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column='user_id')
    cursus = models.ForeignKey(Cursussen, on_delete=models.DO_NOTHING, db_column='cursussen_id')
    voortgang = models.IntegerField(default=0)


class IngschrDomein(models.Model):
    student = models.ForeignKey(User, on_delete=models.DO_NOTHING, db_column='user_id')
    domein = models.ForeignKey(Domeinen, on_delete=models.DO_NOTHING, db_column='domeinen_id')