from django.urls import path
from . import views

app_name = 'analysis'

urlpatterns = [
    path('analyze/', views.PolicyAnalysisView.as_view(), name='analyze'),
    path('compare/', views.PolicyComparisonView.as_view(), name='compare'),
] 