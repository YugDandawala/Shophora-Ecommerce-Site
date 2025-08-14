from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price', 'created_at']
    fields = ['product', 'quantity', 'price', 'total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_number', 'user', 'status', 'payment_status', 'total_amount',
        'item_count', 'created_at', 'shipping_city'
    ]
    list_filter = ['status', 'payment_status', 'created_at', 'shipping_country']
    search_fields = ['order_number', 'user__username', 'shipping_address', 'shipping_city']
    readonly_fields = ['order_number', 'total_amount', 'created_at', 'updated_at', 'item_count']
    inlines = [OrderItemInline]
    list_editable = ['status', 'payment_status']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status', 'payment_status', 'created_at', 'updated_at')
        }),
        ('Shipping Information', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_state', 'shipping_country', 'shipping_postal_code', 'shipping_phone')
        }),
        ('Pricing', {
            'fields': ('subtotal', 'shipping_cost', 'tax_amount', 'discount_amount', 'total_amount')
        }),
        ('Payment', {
            'fields': ('payment_method', 'transaction_id')
        }),
        ('Delivery Tracking', {
            'fields': ('shipped_at', 'delivered_at')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price', 'total_price', 'created_at']
    list_filter = ['created_at', 'order__status']
    search_fields = ['order__order_number', 'product__name']
    readonly_fields = ['total_price', 'created_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('order', 'product')
