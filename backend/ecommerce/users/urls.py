from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationView, UserLoginView, UserProfileViewSet,
    ChangePasswordView
)

router = DefaultRouter()
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('', include(router.urls)),
] 