from django.urls import path
from .views import login_view, logout_view, profile_view

urlpatterns = [
    path("login/", login_view, name="account-login"),
    path("logout/", logout_view, name="account-logout"),
    path("profile/", profile_view, name="account-profile"),
]
