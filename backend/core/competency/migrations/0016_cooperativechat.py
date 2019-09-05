# Generated by Django 2.2.4 on 2019-09-05 05:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('competency', '0015_cooperativenews_thumbnail'),
    ]

    operations = [
        migrations.CreateModel(
            name='CooperativeChat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_last_modified', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField()),
                ('is_locked', models.BooleanField()),
                ('message', models.TextField()),
                ('message_sent', models.DateTimeField()),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('cooperative', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='competency.Cooperative')),
                ('user_created', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='competency_cooperativechat_related_UserCreated', to=settings.AUTH_USER_MODEL)),
                ('user_last_modified', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='competency_cooperativechat_related_UserLastModified', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
