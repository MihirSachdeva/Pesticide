# Generated by Django 3.0.6 on 2020-06-11 14:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pesticide_app', '0015_tag_color'),
    ]

    operations = [
        migrations.AlterField(
            model_name='issue',
            name='status',
            field=models.CharField(choices=[('Open', 'Open'), ('Fixed', 'Fixed'), ('Not_a_bug', 'Not_a_bug'), ('Needs_more_information', 'Needs_more_information'), ('Unclear', 'Unclear')], default='Open', max_length=50),
        ),
        migrations.AlterField(
            model_name='project',
            name='name',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
