# Generated by Django 2.2.3 on 2019-08-02 07:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('competency', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='competency',
            name='tags',
            field=models.ManyToManyField(to='competency.Tag'),
        ),
        migrations.DeleteModel(
            name='CompTags',
        ),
    ]
