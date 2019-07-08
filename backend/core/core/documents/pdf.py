from django.conf import settings
from django.views.generic import DetailView

from django_weasyprint import CONTENT_TYPE_PNG, WeasyTemplateResponseMixin


class MyModelView(DetailView):
    # vanilla Django DetailView
    #model = MyModel
    template_name = 'mymodel.html'


class MyModelPrintView(WeasyTemplateResponseMixin, MyModelView):
    # output of MyModelView rendered as PDF with hardcoded CSS
    pdf_stylesheets = [
        settings.STATIC_ROOT + 'css/app.css',
    ]
    # show pdf in-line (default: True, show download dialog)
    pdf_attachment = False
    # suggested filename (is required for attachment!)
    pdf_filename = 'foo.pdf'


class MyModelImageView(WeasyTemplateResponseMixin, MyModelView):
    # generate a PNG image instead
    content_type = CONTENT_TYPE_PNG

    # dynamically generate filename
    def get_pdf_filename(self):
        return 'bar-{at}.pdf'.format(
            at=timezone.now().strftime('%Y%m%d-%H%M'),
        )