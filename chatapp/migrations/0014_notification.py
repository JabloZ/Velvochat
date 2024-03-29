# Generated by Django 4.0.4 on 2023-08-23 13:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chatapp', '0013_message_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('type', models.TextField(blank=True, max_length=50, null=True)),
                ('text', models.TextField(max_length=500, null=True)),
                ('belongs_to', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='chatapp.profile')),
            ],
        ),
    ]
