# Generated by Django 4.0.4 on 2023-08-06 08:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0005_remove_message_belongs_to_file_belongs_to_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='belongs_to',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='chatapp.groupchat'),
        ),
    ]
