from django.shortcuts import render,redirect
from .forms import DocumentForm
from .models import Document
from .utils import extract_text_from_pdf  # Assuming you have a utility function for text extraction
import os
# Create your views here.
def index(request):
    extracted_text = ""
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            doc = form.save()
            extracted_text = extract_text_from_pdf(doc.file)
    else:
        form = DocumentForm()
    
    documents = Document.objects.all().order_by('-uploaded_at')
    return render(request, 'index.html', {'form': form, 'documents': documents,'extracted_text':extracted_text})  # Replace with actual template name

