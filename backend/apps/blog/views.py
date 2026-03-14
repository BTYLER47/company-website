from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import BlogPost, BlogCategory, Comment
from .serializers import BlogPostSerializer, BlogCategorySerializer, CommentSerializer


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [AllowAny]


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.filter(is_published=True).select_related('author', 'category')
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def comment(self, request, slug=None):
        post = self.get_object()
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post)
            return Response({'message': 'Comment submitted for approval.'})
        return Response(serializer.errors, status=400)
