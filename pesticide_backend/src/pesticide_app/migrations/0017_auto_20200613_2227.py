# Generated by Django 3.0.6 on 2020-06-13 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pesticide_app', '0016_auto_20200611_1951'),
    ]

    operations = [
        migrations.AlterField(
            model_name='issue',
            name='status',
            field=models.CharField(choices=[('Open', 'Open'), ('Fixed', 'Fixed'), ('Not_a_bug', 'Not_a_bug'), ('Needs_more_information', 'Needs_more_information'), ('Unclear', 'Unclear'), ('Closed', 'Closed')], default='Open', max_length=50),
        ),
    ]
