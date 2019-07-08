from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context

from django.conf import settings

def send_mail(self,subject = None, from_email = None, to = None, context = None, plain_text_template = None, html_template = None):
    if settings.DEBUG:
        if subject == None:
            print('MAIL WARNING: "subject" is not defined.')
        if from_email == None:
            print('MAIL WARNING: "from_email" is not defined.')
        if to == None:
            print("MAIL WARNING: No recepients have been given.")
        if context == None:
            print("MAIL WARNING: No context has been given for the template. Ignore if you're serving static mail.")
        if plain_text_template == None:
            print ("MAIL WARNING: Plain text template is recomended for email providers that don't accept HTML.")
        if html_template == None:
            print("MAIL WARNING: HTML template is missing")
    
    
    plaintext = get_template(plain_text_template)
    htmly     = get_template(html_template)

    d = Context(context)
    text_content = plaintext.render(d)
    html_content = htmly.render(d)
    mail = EmailMultiAlternatives(subject, text_content, from_email, [to])
    mail.attach_alternative(html_content, "text/html")
    mail.send(False)