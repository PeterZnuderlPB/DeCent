# Generated by Django 2.2.3 on 2019-08-08 06:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('competency', '0004_auto_20190802_0928'),
    ]

    operations = [
        migrations.AddField(
            model_name='subject',
            name='subject',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='subjectSelfReference', to='competency.Subject'),
        ),
    ]
