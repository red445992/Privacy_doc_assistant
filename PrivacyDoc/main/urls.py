from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('compare/', views.analyze_policy, name='analyze_policy'),  # Optional: separate compare view
]
