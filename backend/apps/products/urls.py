from django.urls import path 
from django.views.generic import TemplateView 
urlpatterns = [path('products/', TemplateView.as_view(template_name='products.html'), name='products')] 
