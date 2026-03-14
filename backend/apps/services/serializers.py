from rest_framework import serializers
from .models import Service, ServiceRequest, ServiceGallery


class ServiceGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceGallery
        fields = ['id', 'image', 'caption']


class ServiceSerializer(serializers.ModelSerializer):
    gallery = ServiceGallerySerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'service_name', 'slug', 'description', 'price',
            'price_label', 'category', 'image', 'gallery',
            'is_active', 'is_featured', 'created_at'
        ]


class ServiceRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceRequest
        fields = [
            'id', 'customer_name', 'email', 'phone', 'service',
            'description', 'image', 'location', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at']
