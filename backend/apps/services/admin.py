from django.contrib import admin
from .models import Service, ServiceRequest, ServiceGallery


class ServiceGalleryInline(admin.TabularInline):
    model = ServiceGallery
    extra = 1


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['service_name', 'category', 'price', 'is_featured', 'is_active']
    list_filter = ['category', 'is_featured', 'is_active']
    search_fields = ['service_name', 'description']
    prepopulated_fields = {'slug': ('service_name',)}
    inlines = [ServiceGalleryInline]


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'email', 'phone', 'service', 'status', 'created_at']
    list_filter = ['status', 'service']
    search_fields = ['customer_name', 'email', 'phone']
    list_editable = ['status']
    readonly_fields = ['created_at', 'updated_at']
