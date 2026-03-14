from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Your message has been sent. We will get back to you shortly.'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Template views
def home(request):
    return render(request, 'home.html')

def about(request):
    return render(request, 'about.html')

def contact_page(request):
    return render(request, 'contact.html')
