# Generated by Django 2.2.3 on 2019-08-02 05:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0003_auto_20190802_0743'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='is_active',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='post',
            name='is_locked',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='post',
            name='user_created',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_post_related_UserCreated', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='post',
            name='user_last_modified',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_post_related_UserLastModified', to=settings.AUTH_USER_MODEL),
        ),
    ]
