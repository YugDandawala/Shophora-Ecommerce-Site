from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from products.models import Category, Product
from decimal import Decimal


class Command(BaseCommand):
    help = 'Populate the database with sample products'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample products...')
        
        # Create categories
        categories = {
            'Electronics': Category.objects.get_or_create(
                name='Electronics',
                slug='electronics',
                defaults={'description': 'Electronic devices and gadgets'}
            )[0],
            'Fashion': Category.objects.get_or_create(
                name='Fashion',
                slug='fashion',
                defaults={'description': 'Clothing and fashion accessories'}
            )[0],
            'Books': Category.objects.get_or_create(
                name='Books',
                slug='books',
                defaults={'description': 'Books and literature'}
            )[0],
            'Home & Kitchen': Category.objects.get_or_create(
                name='Home & Kitchen',
                slug='home-kitchen',
                defaults={'description': 'Home and kitchen appliances'}
            )[0]
        }
        
        # Sample products data
        products_data = [
            {
                'name': 'Premium Wireless Headphones',
                'brand': 'TechAudio',
                'price': Decimal('299.99'),
                'original_price': Decimal('399.99'),
                'category': categories['Electronics'],
                'description': 'High-quality wireless headphones with noise cancellation and premium sound quality.',
                'stock_quantity': 25,
                'sku': 'TECH001',
                'condition': 'new',
                'rating': Decimal('4.5'),
                'review_count': 128,
                'is_featured': True,
                'is_active': True
            },
            {
                'name': 'Smart Watch Pro',
                'brand': 'WristTech',
                'price': Decimal('199.99'),
                'original_price': Decimal('249.99'),
                'category': categories['Electronics'],
                'description': 'Advanced smartwatch with fitness tracking and heart rate monitoring.',
                'stock_quantity': 15,
                'sku': 'TECH002',
                'condition': 'new',
                'rating': Decimal('4.2'),
                'review_count': 89,
                'is_featured': True,
                'is_active': True
            },
            {
                'name': 'Designer Leather Jacket',
                'brand': 'FashionHub',
                'price': Decimal('159.99'),
                'original_price': Decimal('199.99'),
                'category': categories['Fashion'],
                'description': 'Stylish leather jacket perfect for any occasion.',
                'stock_quantity': 8,
                'sku': 'FASH001',
                'condition': 'new',
                'rating': Decimal('4.8'),
                'review_count': 45,
                'is_featured': False,
                'is_active': True
            },
            {
                'name': 'Professional Camera',
                'brand': 'PhotoPro',
                'price': Decimal('799.99'),
                'original_price': Decimal('999.99'),
                'category': categories['Electronics'],
                'description': 'High-end camera for professional photography.',
                'stock_quantity': 12,
                'sku': 'TECH003',
                'condition': 'new',
                'rating': Decimal('4.7'),
                'review_count': 156,
                'is_featured': True,
                'is_active': True
            },
            {
                'name': 'Bestselling Novel',
                'brand': 'BookWorld',
                'price': Decimal('14.99'),
                'original_price': Decimal('19.99'),
                'category': categories['Books'],
                'description': 'Captivating story that will keep you reading all night.',
                'stock_quantity': 50,
                'sku': 'BOOK001',
                'condition': 'new',
                'rating': Decimal('4.3'),
                'review_count': 234,
                'is_featured': False,
                'is_active': True
            },
            {
                'name': 'Kitchen Appliance Set',
                'brand': 'CookMaster',
                'price': Decimal('89.99'),
                'original_price': Decimal('119.99'),
                'category': categories['Home & Kitchen'],
                'description': 'Complete kitchen appliance set for modern cooking.',
                'stock_quantity': 20,
                'sku': 'HOME001',
                'condition': 'new',
                'rating': Decimal('4.4'),
                'review_count': 67,
                'is_featured': False,
                'is_active': True
            },
            {
                'name': 'Gaming Laptop',
                'brand': 'GameTech',
                'price': Decimal('1299.99'),
                'original_price': Decimal('1499.99'),
                'category': categories['Electronics'],
                'description': 'High-performance gaming laptop with latest graphics card.',
                'stock_quantity': 5,
                'sku': 'TECH004',
                'condition': 'new',
                'rating': Decimal('4.6'),
                'review_count': 78,
                'is_featured': True,
                'is_active': True
            }
        ]
        
        # Create products
        for product_data in products_data:
            product, created = Product.objects.get_or_create(
                sku=product_data['sku'],
                defaults=product_data
            )
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created product: {product.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Product already exists: {product.name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample products!')
        ) 