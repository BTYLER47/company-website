"""
Blog app models.
"""

from django.db import models
from django.conf import settings


class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        db_table = 'blog_categories'
        verbose_name_plural = 'Blog Categories'

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='posts')
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, related_name='posts')
    image = models.ImageField(upload_to='blog/', blank=True, null=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'blog'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    content = models.TextField()
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'blog_comments'
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.name} on {self.post}"
