# Generated by Django 2.2.3 on 2019-08-29 06:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_customuser_competencys'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='active_cooperative',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
