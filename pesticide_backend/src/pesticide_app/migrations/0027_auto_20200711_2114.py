# Generated by Django 3.0.6 on 2020-07-11 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pesticide_app', '0026_auto_20200711_1939'),
    ]

    operations = [
        migrations.AlterField(
            model_name='issuestatus',
            name='type',
            field=models.CharField(blank=True, choices=[('Pending', 'Pending'), ('Closed', 'Closed'), ('Resolved', 'Resolved')], default='Pending', max_length=30, null=True),
        ),
    ]