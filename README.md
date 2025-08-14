# Shophora - Modern E-commerce Platform

A full-stack e-commerce application built with React frontend and Django backend, featuring modern UI design with purple/violet color scheme, complete order management, and user authentication.

## 🚀 Features

### Frontend (React)
- **Modern UI Design**: Beautiful purple/violet color scheme with smooth animations and transitions
- **Responsive Layout**: Fully responsive design that works perfectly on desktop, tablet, and mobile devices
- **User Authentication**: 
  - Modern login/register forms with validation
  - JWT token-based authentication
  - Secure logout functionality
  - User profile management
- **Navigation**: 
  - Logo positioned on the left
  - Search bar in the center
  - User actions (wishlist, cart, orders, login/register) on the right
  - Dynamic cart and wishlist counters
- **Shopping Features**:
  - Product browsing with advanced filters (category, brand, price, rating)
  - Shopping cart with quantity management
  - Wishlist functionality
  - Real-time notifications
  - Order placement and tracking
  - Product reviews and ratings
- **Modern Components**:
  - Modal-based authentication forms
  - Floating cart button
  - Category cards with hover effects
  - Product grid with quick view
  - Order success popup
  - Loading states and error handling

### Backend (Django)
- **User Management**:
  - User registration with profile creation
  - Secure login with JWT tokens
  - User profile management with extended fields
  - Password change functionality
  - Email verification support
- **Product Management**:
  - Product CRUD operations
  - Category and brand filtering
  - Advanced search functionality
  - Product reviews and ratings
  - Product images and variants
- **Order Management**:
  - Complete order lifecycle (pending, processing, shipped, delivered, cancelled)
  - Cart management with persistent storage
  - Order tracking and history
  - Payment status tracking
  - Shipping information management
- **Wishlist System**:
  - Add/remove products from wishlist
  - User-specific wishlist management
  - Wishlist synchronization
- **Admin Panel**:
  - Django admin interface for data management
  - User data storage and management
  - Order management interface

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **CSS3** - Custom styling with modern design and animations
- **Font Awesome 6** - Icons and visual elements
- **Context API** - State management
- **Local Storage** - Data persistence
- **React Router** - Navigation and routing

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework 3.14** - API development
- **Django Simple JWT 5.3** - Authentication
- **Django CORS Headers 4.3** - Cross-origin requests
- **SQLite** - Database (development)
- **Pillow 10.1** - Image processing
- **Django Filter 23.5** - Advanced filtering
- **Celery 5.3** - Background tasks
- **Redis 5.0** - Caching and message broker
- **Stripe 7.8** - Payment processing
- **Boto3 1.34** - AWS integration

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend/ecommerce
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (optional)**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django server**:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend/myapp
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start React development server**:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration
- **Database**: SQLite (default) - can be changed to PostgreSQL/MySQL for production
- **CORS**: Configured for React development server
- **JWT**: 60-minute access tokens, 1-day refresh tokens
- **Media Files**: Configured for product images and user profile pictures
- **Pagination**: 12 items per page
- **File Upload**: Product images and user profile pictures

### Frontend Configuration
- **API Base URL**: `http://localhost:8000/api/`
- **Authentication**: JWT tokens stored in localStorage
- **Theme**: Purple/violet color scheme (#8b5cf6, #a855f7)
- **State Management**: React Context API
- **Routing**: React Router for navigation

## 🎨 Design Features

### Color Scheme
- **Primary**: Purple (#8b5cf6)
- **Secondary**: Violet (#a855f7)
- **Accent**: Light purple (#c084fc)
- **Background**: Light gray (#fafafa)
- **Text**: Dark gray (#1e293b)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Yellow (#fbbf24)

### UI Components
- **Modern Cards**: Rounded corners with subtle shadows and hover effects
- **Gradient Buttons**: Purple gradients with hover effects and animations
- **Smooth Animations**: CSS transitions and transforms
- **Responsive Grid**: Flexible layouts for all screen sizes
- **Modal Forms**: Clean authentication forms with validation
- **Notification System**: Real-time notifications with different types
- **Loading States**: Skeleton loaders and spinners

## 🔐 Authentication Flow

1. **Registration**:
   - User fills out registration form with validation
   - Data sent to Django backend
   - User created with profile
   - JWT tokens returned and stored
   - User automatically logged in

2. **Login**:
   - User enters credentials
   - Backend validates and returns JWT tokens
   - Tokens stored in localStorage
   - User session established

3. **Logout**:
   - Tokens cleared from localStorage
   - User state reset
   - Cart and wishlist cleared

## 📱 Responsive Design

The application is fully responsive with:
- **Desktop**: Full navigation with all features and sidebars
- **Tablet**: Optimized layout for medium screens with adjusted spacing
- **Mobile**: Stacked navigation, touch-friendly buttons, and mobile-first design

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings
2. Configure production database (PostgreSQL recommended)
3. Set up static file serving
4. Configure CORS for production domain
5. Set up environment variables
6. Configure media file storage (AWS S3 recommended)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to hosting service (Netlify, Vercel, etc.)
3. Update API base URL for production
4. Configure environment variables

## 📝 API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `PUT /api/users/change-password/` - Change password
- `POST /api/token/` - JWT token obtain
- `POST /api/token/refresh/` - JWT token refresh
- `POST /api/token/verify/` - JWT token verify

### User Profile
- `GET /api/users/profile/me/` - Get user profile
- `PUT /api/users/profile/me/` - Update user profile

### Wishlist
- `GET /api/users/wishlist/` - Get user wishlist
- `POST /api/users/wishlist/add_to_wishlist/` - Add to wishlist
- `DELETE /api/users/wishlist/remove_from_wishlist/` - Remove from wishlist

### Products
- `GET /api/products/` - List products with filtering
- `GET /api/products/{slug}/` - Get product details
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/{slug}/reviews/` - Get product reviews
- `POST /api/products/{slug}/add_review/` - Add product review
- `GET /api/categories/` - List categories
- `GET /api/categories/{slug}/products/` - Get products by category

### Cart
- `GET /api/cart/` - Get user cart
- `POST /api/cart/add_item/` - Add item to cart
- `PUT /api/cart/{id}/` - Update cart item
- `DELETE /api/cart/{id}/` - Remove cart item
- `DELETE /api/cart/clear_cart/` - Clear cart
- `GET /api/cart/cart_summary/` - Get cart summary

### Orders
- `GET /api/orders/` - Get user orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `POST /api/orders/create_from_cart/` - Create order from cart
- `POST /api/orders/{id}/cancel_order/` - Cancel order
- `GET /api/orders/order_history/` - Get order history

## 🗂️ Project Structure

```
ecommerce/
├── backend/
│   ├── ecommerce/
│   │   ├── ecommerce/
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py
│   │   ├── products/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   ├── users/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   ├── orders/
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   ├── serializers.py
│   │   │   └── urls.py
│   │   └── manage.py
│   └── requirements.txt
├── frontend/
│   └── myapp/
│       ├── src/
│       │   ├── components/
│       │   │   ├── Navigation.js
│       │   │   ├── HeroSection.js
│       │   │   ├── ProductGrid.js
│       │   │   ├── ProductCard.js
│       │   │   ├── ProductDetailPage.js
│       │   │   ├── CartPage.js
│       │   │   ├── OrdersPage.js
│       │   │   ├── WishlistPage.js
│       │   │   ├── AuthModal.js
│       │   │   ├── Notification.js
│       │   │   └── ...
│       │   ├── context/
│       │   │   └── EcommerceContext.js
│       │   ├── styles/
│       │   │   ├── App.css
│       │   │   └── index.css
│       │   ├── data/
│       │   │   └── products.js
│       │   ├── App.js
│       │   └── index.js
│       ├── public/
│       └── package.json
└── README.md
```

## 🔄 State Management

The application uses React Context API for state management:
- **Global State**: User authentication, cart, wishlist, notifications
- **Local State**: Component-specific state (forms, modals, etc.)
- **Persistence**: Local storage for cart, wishlist, and user tokens

## 🎯 Key Features

### Shopping Experience
- **Product Discovery**: Advanced filtering and search
- **Shopping Cart**: Persistent cart with quantity management
- **Wishlist**: Save products for later
- **Order Management**: Complete order lifecycle
- **Reviews & Ratings**: User-generated content

### User Experience
- **Responsive Design**: Works on all devices
- **Modern UI**: Clean, intuitive interface
- **Real-time Updates**: Live notifications and state changes
- **Error Handling**: Comprehensive error messages
- **Loading States**: Smooth loading experiences

### Technical Features
- **JWT Authentication**: Secure token-based auth
- **RESTful API**: Well-structured API endpoints
- **Database Design**: Normalized database schema
- **Image Handling**: Product and profile image management
- **Search & Filter**: Advanced product discovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Future Enhancements

- **Payment Integration**: Stripe payment processing
- **Email Notifications**: Order confirmations and updates
- **Admin Dashboard**: Enhanced admin interface
- **Mobile App**: React Native mobile application
- **Analytics**: User behavior and sales analytics
- **Multi-language**: Internationalization support
- **Advanced Search**: Elasticsearch integration
- **Real-time Chat**: Customer support chat

---

**Shophora** - Where shopping meets elegance! 🛍️✨

*Built with ❤️ using React and Django* 