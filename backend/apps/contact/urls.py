from django.urls import path
from .views import ContactAPIView, home, about, contact_page

urlpatterns = [
    path('', home, name='home'),
    path('about/', about, name='about'),
    path('contact/', contact_page, name='contact'),
]
