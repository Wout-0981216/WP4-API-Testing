# Generated by Django 5.0.4 on 2024-06-13 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_alter_voortgangactiviteitenniveaus_voortgang_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='voortgangconceptopdrachten',
            name='ingeleverd_tekst',
            field=models.TextField(blank=True, null=True),
        ),
    ]
