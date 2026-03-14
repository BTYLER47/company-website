from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Order.objects.all().prefetch_related('items__product')
        return Order.objects.filter(user=user).prefetch_related('items__product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
