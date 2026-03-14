from django.urls import path 
from django.views.generic import TemplateView 
urlpatterns = [path('services/', TemplateView.as_view(template_name='services.html'), name='services'), path('service-request/', TemplateView.as_view(template_name='service_request.html'), name='service_request')] 
