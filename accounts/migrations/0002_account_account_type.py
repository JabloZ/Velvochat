# Generated by Django 4.0.4 on 2023-08-31 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='account_type',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]