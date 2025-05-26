from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_api import PolicyAnalysisViewSet

router = DefaultRouter()
router.register(r'analysis', PolicyAnalysisViewSet, basename='analysis')

urlpatterns = [
    path('', include(router.urls)),
] 