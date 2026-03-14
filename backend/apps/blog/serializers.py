from rest_framework import serializers
from .models import BlogPost, BlogCategory, Comment


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'name', 'email', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.name', read_only=True)
    category = BlogCategorySerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True, source='comments.filter(is_approved=True)')

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt', 'author_name',
            'category', 'image', 'is_published', 'comments', 'created_at'
        ]
