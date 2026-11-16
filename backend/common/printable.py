"""Printable HTML documents (bills, KOT slips, reports).

The page is rendered by the browser, so no PDF/GTK libraries are needed on the server. The
browser's print dialog also offers "Save as PDF". Add ``?print=0`` to view without the dialog.
"""

from django.http import HttpResponse
from django.template.loader import get_template

RECEIPT_PAGE = '@page { size: 3.5in auto; margin: 0; }'
A4_PAGE = '@page { size: A4; margin: 1.5rem; }'

_PRINT_ON_LOAD = '<script>window.addEventListener("load", function () { window.print(); });</script>'


def printable_response(request, template_name, context, page_css=A4_PAGE):
    html = get_template(template_name).render(context, request)
    extra = f'<style>{page_css}</style>'
    if request.GET.get('print') != '0':
        extra += _PRINT_ON_LOAD
    if '</head>' in html:
        html = html.replace('</head>', extra + '</head>', 1)
    else:
        html = extra + html
    response = HttpResponse(html, content_type='text/html; charset=utf-8')
    response['Cache-Control'] = 'no-store'
    return response
