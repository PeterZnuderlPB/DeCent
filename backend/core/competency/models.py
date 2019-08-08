from django.db import models
from core.models import PBModel
from django.conf import settings

# Create your models here.

class Category(PBModel):
    name = models.TextField()

    def __str__(self):
        return f'{self.name}'

class Subcategory(PBModel):
    name = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.category.name} - {self.name}'

class OrganizationType(PBModel):
    _type = models.TextField()

    def __str__(self):
        return f'{self._type}'

class Organization(PBModel):
    name = models.TextField()
    organization_type = models.ForeignKey(OrganizationType, on_delete=models.CASCADE)
    account = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.name} - {self.organization_type._type} - {self.account.username}'

class SubjectType(PBModel):
    _type = models.TextField()

    def __str__(self):
        return f'{self._type}'

class Subject(PBModel):
    name = models.TextField()
    subject_type = models.ForeignKey(SubjectType, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    subject = models.ForeignKey('self', on_delete=models.CASCADE, related_name="subjectSelfReference", null=True, blank=True)

    def __str__(self):
        return f'{self.name} - {self.subject_type._type} - {self.organization.name}'

class EvaluationType(PBModel):
    _type = models.TextField()

    def __str__(self):
        return f'{self._type}'

class Evaluation(PBModel):
    comment = models.TextField()
    evaluation_date = models.DateField()
    evaluation_type = models.ForeignKey(EvaluationType, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def __str__(self):
        return f'Added on {self.evaluation_date} - {self.evaluation_type} - {self.subject.name}'

class Estimate(PBModel):
    estimate_date = models.DateField()
    term_start = models.DateField()
    term_end = models.DateField()
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE)

    def __str__(self):
        return f'Added on {self.estimate_date} - Term -> {self.term_start}_{self.term_end} - EvaluationID[{self.evaluation.id}]'

class Tag(PBModel):
    tag = models.TextField()

    def __str__(self):
        return f'{self.tag}'

class Competency(PBModel):
    name = models.TextField()
    description = models.TextField()
    definition = models.TextField()
    essential_knoweledge = models.TextField()
    optional_knoweledge = models.TextField()
    competency = models.ForeignKey('self', on_delete=models.CASCADE, related_name="compotencySelfReference", null=True, blank=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return f'{self.name} - Owner -> {self.organization.name}'

class CompQuestion(PBModel):
    question = models.TextField()
    description = models.TextField()
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.question} - Owner -> {self.competency.name}'

class PredefinedAnswer(PBModel):
    answer = models.TextField()
    comp_question = models.ForeignKey(CompQuestion, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.answer} - {self.comp_question.question}'

class Answer(PBModel):
    comment = models.TextField()
    predefined_answer = models.ForeignKey(PredefinedAnswer, on_delete=models.CASCADE, related_name="PredefinedAnswerFK")
    comp_question = models.ForeignKey(CompQuestion, on_delete=models.CASCADE)
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE)

    def __str__(self):
        return 'Answer'

class CompRating(PBModel):
    tier = models.SmallIntegerField()
    name = models.TextField()
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    evaluation = models.ForeignKey(Evaluation, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.tier} - {self.name}'

class UserPermission(PBModel):
    permissions = models.TextField()
    account = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    subject = models.ManyToManyField(Subject, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.account.username} - {self.organization.name} - {self.permissions}'