from django.contrib import admin
from .models import BlogPost, BlogCategory, Comment


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    list_display = ['name', 'email', 'is_approved', 'created_at']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'is_published', 'created_at']
    list_filter = ['is_published', 'category']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_published']
    inlines = [CommentInline]


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'post', 'is_approved', 'created_at']
    list_editable = ['is_approved']
    list_filter = ['is_approved']
