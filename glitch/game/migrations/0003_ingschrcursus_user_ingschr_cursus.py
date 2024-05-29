# Generated by Django 5.0.4 on 2024-05-29 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_remove_user_ingschr_cursus_alter_cursussen_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='IngschrCursus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('voortgang', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'game_user_ingschr_cursus',
                'managed': False,
            },
        ),
        migrations.AddField(
            model_name='user',
            name='ingschr_cursus',
            field=models.ManyToManyField(blank=True, through='game.IngschrCursus', to='game.cursussen'),
        ),
    ]
