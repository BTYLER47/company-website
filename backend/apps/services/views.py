from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Service, ServiceRequest
from .serializers import ServiceSerializer, ServiceRequestSerializer


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.filter(is_active=True).prefetch_related('gallery')
    serializer_class = ServiceSerializer
    lookup_field = 'slug'


class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'patch', 'delete']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Service request submitted successfully. We will contact you shortly.', 'data': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
