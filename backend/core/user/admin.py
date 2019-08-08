from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserChangeForm, CustomUserCreationForm
from .models import CustomUser

# Register your models here.
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['email', 'username', 'first_name'] # Columns in the list of users in the admin console
    fieldsets = UserAdmin.fieldsets + (                 # Fields in the edit and create view of the admin console
            ('Custom infromation', {'fields': ('biography', 'active_organization_id',)}),
    )

admin.site.register(CustomUser, CustomUserAdmin)