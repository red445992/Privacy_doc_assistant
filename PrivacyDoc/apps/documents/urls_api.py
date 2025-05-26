from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views_api import DocumentViewSet, DocumentCategoryViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'categories', DocumentCategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
] 