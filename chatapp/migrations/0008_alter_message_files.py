# Generated by Django 4.0.4 on 2023-08-06 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0007_remove_file_belongs_to_alter_message_files'),
    ]

    operations = [
        migrations.AlterField(
            model_name='message',
            name='files',
            field=models.ManyToManyField(blank=True, null=True, related_name='files', to='chatapp.file'),
        ),
    ]
