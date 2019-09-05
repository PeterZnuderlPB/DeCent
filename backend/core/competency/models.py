from django.db import models
from core.models import PBModel
from django.conf import settings
import datetime

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
        return f'Subject #{self.id} - {self.name} - {self.subject_type._type} - {self.organization.name}'

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

class Comment(PBModel):
    comment = models.TextField()
    competency = models.ForeignKey(Competency, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    account = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f'Comment #{self.id} - {self.account.username} - {self.organization.name} - {self.competency.name}'


#-------------------------------------------------
# WorkOrder project - includes Competencies model
#-------------------------------------------------
class Cooperative(PBModel):
    title = models.TextField()
    about = models.TextField()
    official = models.BooleanField(blank=True, null=True, default=False)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owner")
    workers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="workers")
    competencys = models.ManyToManyField(Competency)

    def __str__(self):
        return f'Cooperative #{self.id} - {self.title} - O: {self.owner.username}'

class CooperativeEnrollment(PBModel):
    enroller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cooperative = models.ForeignKey(Cooperative, on_delete=models.CASCADE)
    comment = models.TextField()

    def __str__(self):
        return f'CooperativeEnrollment #{self.id} - U: {self.enroller.username} - C: {self.cooperative.title}'

class Project(PBModel):
    name = models.TextField()
    description = models.TextField()
    account = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    competency = models.ManyToManyField(Competency, blank=True)
    file_directory = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(blank=False, null=False, default=False)

    def __str__(self):
        return f'Project #{self.id} - {self.name} - {self.account.username}'

class WorkOrder(PBModel):
    name = models.TextField()
    description = models.TextField()
    competency = models.ManyToManyField(Competency, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return f'WorkOrder #{self.id} - {self.name} - Project #{self.project.id}'

class CooperativeNews(PBModel):
    title = models.TextField()
    content = models.TextField()
    thumbnail = models.FileField(null=True)
    date_published = models.DateField()
    cooperative = models.ForeignKey(Cooperative, on_delete=models.CASCADE)

    def __str__(self):
        return f'CooperativeNews #{self.id} - {self.title} - "Cooperative #{self.cooperative.id}'

class CooperativeChat(PBModel):
    message = models.TextField()
    message_sent = models.DateTimeField()
    account = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cooperative = models.ForeignKey(Cooperative, on_delete=models.CASCADE)

    def __str__(self):
        return f'CooperativeChat #{self.id} - Cooperative #{self.cooperative.id}'

class Contract(PBModel):
    stage = models.IntegerField() # Maybe another table?
    status = models.IntegerField() # Maybe another table?
    is_pending = models.BooleanField()
    date_proposed = models.DateField(default=datetime.date.today)
    estimate_finish_date = models.DateField()
    cooperative = models.ForeignKey(Cooperative, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return f'Contract #{self.id} - Pending: {self.status} - Cooperative #{self.cooperative.id} - Project #{self.project.id}'