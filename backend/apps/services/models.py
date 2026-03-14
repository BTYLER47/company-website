"""
Services app models.
"""

from django.db import models


class Service(models.Model):
    CATEGORY_CHOICES = [
        ('it_sales', 'IT Equipment Sales'),
        ('repair', 'Computer Repair'),
        ('network', 'Network Setup'),
        ('office', 'Office Infrastructure'),
        ('cctv', 'CCTV Installation'),
        ('printer', 'Printer Servicing'),
        ('printing', 'Printing Services'),
        ('branding', 'Branding Services'),
    ]

    service_name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_label = models.CharField(max_length=100, default='Starting from')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'services'
        ordering = ['category', 'service_name']

    def __str__(self):
        return self.service_name


class ServiceGallery(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='services/gallery/')
    caption = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = 'service_gallery'


class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    customer_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, related_name='requests')
    description = models.TextField()
    image = models.ImageField(upload_to='service_requests/', blank=True, null=True)
    location = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'service_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"Request from {self.customer_name} - {self.service}"
