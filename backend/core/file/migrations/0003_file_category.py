# Generated by Django 2.1.10 on 2019-07-19 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('file', '0002_auto_20190715_1007'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='category',
            field=models.CharField(default='default', max_length=100),
            preserve_default=False,
        ),
    ]
