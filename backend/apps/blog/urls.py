from django.urls import path 
from django.views.generic import TemplateView 
urlpatterns = [path('blog/', TemplateView.as_view(template_name='blog.html'), name='blog')] 
