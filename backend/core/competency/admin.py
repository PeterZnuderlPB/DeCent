from django.contrib import admin
from .models import (
    Category,
    Subcategory,
    OrganizationType,
    Organization,
    SubjectType,
    Subject,
    EvaluationType,
    Evaluation,
    Estimate,
    Competency,
    Tag,
    CompQuestion,
    PredefinedAnswer,
    Answer,
    CompRating,
    UserPermission,
    Comment,
    Project,
    WorkOrder
)

# Register your models here.

admin.site.register(Category)
admin.site.register(Subcategory)
admin.site.register(OrganizationType)
admin.site.register(Organization)
admin.site.register(SubjectType)
admin.site.register(Subject)
admin.site.register(EvaluationType)
admin.site.register(Evaluation)
admin.site.register(Estimate)
admin.site.register(Competency)
admin.site.register(Tag)
admin.site.register(CompQuestion)
admin.site.register(PredefinedAnswer)
admin.site.register(Answer)
admin.site.register(CompRating)
admin.site.register(UserPermission)
admin.site.register(Comment)
admin.site.register(Project)
admin.site.register(WorkOrder)