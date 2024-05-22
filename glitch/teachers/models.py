# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class DjangoAdminLog(models.Model):
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('GameUser', models.DO_NOTHING)
    action_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class GameActiviteiten(models.Model):
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640)
    module = models.ForeignKey('GameModules', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_activiteiten'


class GameConceptopdracht(models.Model):
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640)
    module = models.ForeignKey('GameModules', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_conceptopdracht'


class GameCursussen(models.Model):
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640)

    class Meta:
        managed = False
        db_table = 'game_cursussen'


class GameHoofdopdrachten(models.Model):
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640)
    module = models.ForeignKey('GameModules', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_hoofdopdrachten'


class GameModules(models.Model):
    naam = models.CharField(max_length=64)
    beschrijving = models.CharField(max_length=640)
    cursus = models.ForeignKey(GameCursussen, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_modules'


class GameNiveaus(models.Model):
    beschrijving = models.CharField(max_length=640)
    activiteit = models.ForeignKey(GameActiviteiten, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_niveaus'


class GamePuntenuitdagingen(models.Model):
    benodige_punten = models.IntegerField()
    module = models.ForeignKey(GameModules, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_puntenuitdagingen'


class GameUser(models.Model):
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    username = models.CharField(unique=True, max_length=64)
    password = models.CharField(max_length=64)
    is_teacher = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'game_user'


class GameUserGroups(models.Model):
    user = models.ForeignKey(GameUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_user_groups'
        unique_together = (('user', 'group'),)


class GameUserIngschrCursus(models.Model):
    user = models.ForeignKey(GameUser, models.DO_NOTHING)
    cursussen = models.ForeignKey(GameCursussen, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_user_ingschr_cursus'
        unique_together = (('user', 'cursussen'),)


class GameUserUserPermissions(models.Model):
    user = models.ForeignKey(GameUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_user_user_permissions'
        unique_together = (('user', 'permission'),)


class GameVoortgangactiviteitenniveaus(models.Model):
    voortgang = models.IntegerField()
    niveau = models.ForeignKey(GameNiveaus, models.DO_NOTHING, blank=True, null=True)
    student = models.ForeignKey(GameUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_voortgangactiviteitenniveaus'


class GameVoortgangconceptopdrachten(models.Model):
    voortgang = models.BooleanField()
    concept_opdracht = models.ForeignKey(GameConceptopdracht, models.DO_NOTHING, blank=True, null=True)
    student = models.ForeignKey(GameUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_voortgangconceptopdrachten'


class GameVoortganghoofdopdrachten(models.Model):
    voortgang = models.BooleanField()
    hoofd_opdracht = models.ForeignKey(GameHoofdopdrachten, models.DO_NOTHING)
    student = models.ForeignKey(GameUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_voortganghoofdopdrachten'


class GameVoortgangpuntenuitdaging(models.Model):
    voortgang = models.BooleanField()
    punten_uitdaging = models.ForeignKey(GamePuntenuitdagingen, models.DO_NOTHING, blank=True, null=True)
    student = models.ForeignKey(GameUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'game_voortgangpuntenuitdaging'


class TokenBlacklistBlacklistedtoken(models.Model):
    blacklisted_at = models.DateTimeField()
    token = models.OneToOneField('TokenBlacklistOutstandingtoken', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'token_blacklist_blacklistedtoken'


class TokenBlacklistOutstandingtoken(models.Model):
    token = models.TextField()
    created_at = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField()
    user = models.ForeignKey(GameUser, models.DO_NOTHING, blank=True, null=True)
    jti = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'token_blacklist_outstandingtoken'
