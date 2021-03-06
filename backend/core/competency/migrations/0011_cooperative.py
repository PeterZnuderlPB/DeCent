# Generated by Django 2.2.3 on 2019-08-29 05:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('competency', '0010_project_is_public'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cooperative',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_last_modified', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField()),
                ('is_locked', models.BooleanField()),
                ('title', models.TextField()),
                ('about', models.TextField()),
                ('competencys', models.ManyToManyField(to='competency.Competency')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owner', to=settings.AUTH_USER_MODEL)),
                ('user_created', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='competency_cooperative_related_UserCreated', to=settings.AUTH_USER_MODEL)),
                ('user_last_modified', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='competency_cooperative_related_UserLastModified', to=settings.AUTH_USER_MODEL)),
                ('workers', models.ManyToManyField(related_name='workers', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
