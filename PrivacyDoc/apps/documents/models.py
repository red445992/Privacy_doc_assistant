from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _


class DocumentCategory(models.Model):
    """Model for document categories."""
    name = models.CharField(_('name'), max_length=100)
    description = models.TextField(_('description'), blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')

    def __str__(self):
        return self.name


class Document(models.Model):
    """Model for storing documents."""
    title = models.CharField(_('title'), max_length=200)
    file = models.FileField(_('file'), upload_to='documents/')
    uploaded_at = models.DateTimeField(_('uploaded at'), auto_now_add=True)
    processed_text = models.TextField(_('processed text'), blank=True)
    is_processed = models.BooleanField(_('is processed'), default=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    file_size = models.PositiveIntegerField(_('file size'), default=0)
    file_type = models.CharField(_('file type'), max_length=50, blank=True)
    category = models.ForeignKey(
        DocumentCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='documents'
    )
    version = models.PositiveIntegerField(_('version'), default=1)
    parent_version = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='child_versions'
    )
    is_shared = models.BooleanField(_('is shared'), default=False)
    shared_with = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='shared_documents',
        blank=True
    )
    search_vector = models.TextField(_('search vector'), blank=True)

    class Meta:
        verbose_name = _('document')
        verbose_name_plural = _('documents')
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['uploaded_at']),
            models.Index(fields=['category']),
            models.Index(fields=['is_processed']),
        ]

    def __str__(self):
        return f"{self.title} (v{self.version})"

    def save(self, *args, **kwargs):
        if not self.pk:  # New document
            self.version = 1
        else:
            # Check if file has changed
            old_doc = Document.objects.get(pk=self.pk)
            if old_doc.file != self.file:
                self.version += 1
                self.parent_version = old_doc
        if self.file:
            self.file_size = self.file.size
            self.file_type = self.file.name.split('.')[-1].lower()
        super().save(*args, **kwargs)

    def get_version_history(self):
        """Get the complete version history of the document."""
        history = []
        current = self
        while current:
            history.append(current)
            current = current.parent_version
        return history[::-1]  # Return in chronological order

    def share_with(self, users):
        """Share the document with specified users."""
        self.is_shared = True
        self.shared_with.add(*users)
        self.save()

    def unshare_with(self, users):
        """Remove sharing with specified users."""
        self.shared_with.remove(*users)
        if not self.shared_with.exists():
            self.is_shared = False
        self.save() 