from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Custom user model."""
    email = models.EmailField(_('email address'), unique=True)
    bio = models.TextField(_('bio'), max_length=500, blank=True)
    organization = models.CharField(_('organization'), max_length=100, blank=True)
    
    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return self.email 