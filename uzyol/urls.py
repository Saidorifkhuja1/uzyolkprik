from django.urls import path

from .views import page_detail, pages, site_payload

urlpatterns = [
    path("site/", site_payload, name="site-payload"),
    path("pages/", pages, name="pages"),
    path("pages/<slug:slug>/", page_detail, name="page-detail"),
]
