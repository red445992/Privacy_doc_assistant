from django.urls import path
from . import views

app_name = 'documents'

urlpatterns = [
    path('', views.DocumentListView.as_view(), name='list'),
    path('create/', views.DocumentCreateView.as_view(), name='create'),
    path('<int:pk>/', views.DocumentDetailView.as_view(), name='detail'),
    path('<int:pk>/delete/', views.DocumentDeleteView.as_view(), name='delete'),
] 