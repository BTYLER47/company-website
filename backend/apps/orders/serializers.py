from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.product_name', read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'user_name', 'items', 'total_price',
            'payment_status', 'order_status', 'shipping_address',
            'notes', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
