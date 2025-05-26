from django.apps import AppConfig


class DocumentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.documents'
    verbose_name = 'Documents'

    def ready(self):
        try:
            import apps.documents.signals  # noqa
        except ImportError:
            pass 