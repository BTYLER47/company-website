from django.contrib import admin
from .models import Product, Category, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['product_name', 'category', 'price', 'stock', 'is_featured', 'is_active', 'created_at']
    list_filter = ['category', 'is_featured', 'is_active']
    search_fields = ['product_name', 'description']
    prepopulated_fields = {'slug': ('product_name',)}
    inlines = [ProductImageInline]
    list_editable = ['price', 'stock', 'is_featured', 'is_active']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
