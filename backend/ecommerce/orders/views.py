from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Order, OrderItem
from .serializers import (
    OrderSerializer, OrderCreateSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        """Create a new order with proper error handling"""
        try:
            with transaction.atomic():
                print(f"DEBUG: Received request data: {request.data}")
                serializer = self.get_serializer(data=request.data, context={'request': request})
                if serializer.is_valid():
                    order = serializer.save()
                    
                    # Return success response with order details
                    return Response({
                        'message': 'Order placed successfully!',
                        'order_number': order.order_number,
                        'order_id': order.id,
                        'total_amount': str(order.total_amount),
                        'status': order.status,
                        'payment_status': order.payment_status
                    }, status=status.HTTP_201_CREATED)
                else:
                    print(f"DEBUG: Serializer errors: {serializer.errors}")
                    return Response({
                        'error': 'Invalid order data',
                        'details': serializer.errors
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
        except ValidationError as e:
            print(f"DEBUG: ValidationError: {e}")
            return Response({
                'error': 'Validation error',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"DEBUG: Exception: {e}")
            return Response({
                'error': 'Failed to place order',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        """Cancel an order"""
        try:
            order = self.get_object()
            
            if order.status in ['shipped', 'delivered']:
                return Response({
                    'error': 'Cannot cancel order that has been shipped or delivered'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            order.status = 'cancelled'
            order.save()
            
            return Response({
                'message': 'Order cancelled successfully'
            })
        except Exception as e:
            return Response({
                'error': 'Failed to cancel order',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def order_history(self, request):
        """Get user's order history"""
        try:
            orders = self.get_queryset().order_by('-created_at')
            serializer = self.get_serializer(orders, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': 'Failed to fetch order history',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def order_details(self, request, pk=None):
        """Get detailed order information"""
        try:
            order = self.get_object()
            serializer = self.get_serializer(order, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({
                'error': 'Failed to fetch order details',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
