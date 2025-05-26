from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.views.generic import ListView, DetailView, CreateView, DeleteView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Document
from .forms import DocumentForm
from utils.pdf_processor import PDFProcessor


class DocumentListView(LoginRequiredMixin, ListView):
    model = Document
    template_name = 'documents/document_list.html'
    context_object_name = 'documents'
    paginate_by = 10

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user).order_by('-uploaded_at')


class DocumentDetailView(LoginRequiredMixin, DetailView):
    model = Document
    template_name = 'documents/document_detail.html'
    context_object_name = 'document'

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)


class DocumentCreateView(LoginRequiredMixin, CreateView):
    model = Document
    form_class = DocumentForm
    template_name = 'documents/document_form.html'
    success_url = reverse_lazy('documents:list')

    def form_valid(self, form):
        form.instance.user = self.request.user
        response = super().form_valid(form)
        
        # Process the document
        try:
            pdf_processor = PDFProcessor()
            text = pdf_processor.extract_text(self.object.file.path)
            if text:
                cleaned_text = pdf_processor.clean_text(text)
                self.object.processed_text = cleaned_text
                self.object.is_processed = True
                self.object.save()
                messages.success(self.request, 'Document processed successfully.')
            else:
                messages.warning(self.request, 'Could not extract text from the document.')
        except Exception as e:
            messages.error(self.request, f'Error processing document: {str(e)}')
        
        return response


class DocumentDeleteView(LoginRequiredMixin, DeleteView):
    model = Document
    template_name = 'documents/document_confirm_delete.html'
    success_url = reverse_lazy('documents:list')

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

    def delete(self, request, *args, **kwargs):
        messages.success(request, 'Document deleted successfully.')
        return super().delete(request, *args, **kwargs) 