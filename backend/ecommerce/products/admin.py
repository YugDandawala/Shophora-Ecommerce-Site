from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'price', 'original_price', 'stock_quantity',
        'is_featured', 'is_active', 'rating', 'created_at'
    ]
    list_filter = [
        'category', 'condition', 'is_featured', 'is_active', 'created_at'
    ]
    search_fields = ['name', 'description', 'brand', 'sku']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['rating', 'review_count']
    list_editable = ['price', 'stock_quantity', 'is_featured', 'is_active']
