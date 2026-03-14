from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_price', 'payment_status', 'order_status', 'created_at']
    list_filter = ['payment_status', 'order_status']
    search_fields = ['user__name', 'user__email']
    list_editable = ['order_status', 'payment_status']
    inlines = [OrderItemInline]
    readonly_fields = ['created_at', 'updated_at']
