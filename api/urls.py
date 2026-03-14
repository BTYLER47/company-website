from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.products.views import ProductViewSet, CategoryViewSet
from apps.services.views import ServiceViewSet, ServiceRequestViewSet
from apps.orders.views import OrderViewSet
from apps.blog.views import BlogPostViewSet, BlogCategoryViewSet
from apps.contact.views import ContactAPIView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'product-categories', CategoryViewSet, basename='product-category')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'service-request', ServiceRequestViewSet, basename='service-request')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'blog', BlogPostViewSet, basename='blog')
router.register(r'blog-categories', BlogCategoryViewSet, basename='blog-category')

urlpatterns = [
    path('', include(router.urls)),
    path('contact/', ContactAPIView.as_view(), name='contact-api'),
]

