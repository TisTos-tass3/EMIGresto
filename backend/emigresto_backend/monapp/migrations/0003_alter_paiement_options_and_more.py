# Generated by Django 5.2.1 on 2025-05-25 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monapp', '0002_remove_utilisateur_mot_de_passe_etudiant_genre'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='paiement',
            options={'ordering': ['-date']},
        ),
        migrations.AddIndex(
            model_name='paiement',
            index=models.Index(fields=['date'], name='paiement_date_02b163_idx'),
        ),
    ]
