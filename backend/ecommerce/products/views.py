from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from .models import Category, Product
from .serializers import (
    CategorySerializer, ProductSerializer, ProductListSerializer,
    ProductDetailSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """Get all products in a category"""
        category = self.get_object()
        products = Product.objects.filter(category=category, is_active=True)
        
        # Apply filters
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        condition = request.query_params.get('condition')
        brand = request.query_params.get('brand')
        sort_by = request.query_params.get('sort_by', 'created_at')
        
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)
        if condition:
            products = products.filter(condition=condition)
        if brand:
            products = products.filter(brand__icontains=brand)
        
        # Sorting
        if sort_by == 'price_low':
            products = products.order_by('price')
        elif sort_by == 'price_high':
            products = products.order_by('-price')
        elif sort_by == 'rating':
            products = products.order_by('-rating')
        elif sort_by == 'name':
            products = products.order_by('name')
        else:
            products = products.order_by('-created_at')
        
        serializer = ProductListSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'condition', 'brand', 'is_featured']
    search_fields = ['name', 'description', 'brand']
    ordering_fields = ['price', 'rating', 'created_at', 'name']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        products = self.get_queryset().filter(is_featured=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced search with multiple filters"""
        query = request.query_params.get('q', '')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        category = request.query_params.get('category')
        condition = request.query_params.get('condition')
        brand = request.query_params.get('brand')
        sort_by = request.query_params.get('sort_by', 'created_at')
        
        products = self.get_queryset()
        
        # Search query
        if query:
            products = products.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(brand__icontains=query)
            )
        
        # Filters
        if min_price:
            products = products.filter(price__gte=min_price)
        if max_price:
            products = products.filter(price__lte=max_price)
        if category:
            products = products.filter(category__slug=category)
        if condition:
            products = products.filter(condition=condition)
        if brand:
            products = products.filter(brand__icontains=brand)
        
        # Sorting
        if sort_by == 'price_low':
            products = products.order_by('price')
        elif sort_by == 'price_high':
            products = products.order_by('-price')
        elif sort_by == 'rating':
            products = products.order_by('-rating')
        elif sort_by == 'name':
            products = products.order_by('name')
        else:
            products = products.order_by('-created_at')
        
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
