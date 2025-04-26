from django.urls import path 
from . import views
urlpatterns = [
    path("",views.index,name="index"),
    #  path('delete/<int:document_id>/', views.delete_document, name='delete_document'),
]
