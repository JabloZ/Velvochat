# Generated by Django 4.0.4 on 2023-07-29 20:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0002_friendsrequest_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupchat',
            name='type',
            field=models.CharField(default='private', max_length=10),
            preserve_default=False,
        ),
    ]
