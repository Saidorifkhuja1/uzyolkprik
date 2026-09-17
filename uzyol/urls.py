from django.urls import path

from .views import (
    elonlar_detail_update_delete,
    elonlar_list_create,
    filiallar_detail_update_delete,
    filiallar_list_create,
    leaders_list_create,
    leader_detail_update_delete,
    narx_navo_list_create,
    narx_navo_detail_update_delete,
    vacancies_list_create,
    vacancies_detail_update_delete,
    catalog_items_list_create,
    catalog_item_detail_update_delete,
    home_content_update,
    contact_settings_update,
    announcement_settings_update,
    page_detail,
    pages,
    site_payload,
)

urlpatterns = [
    path("site/", site_payload, name="site-payload"),
    path("pages/", pages, name="pages"),
    path("pages/<slug:slug>/", page_detail, name="page-detail"),
    path("elonlar/", elonlar_list_create, name="elonlar-list-create"),
    path("elonlar/<int:pk>/", elonlar_detail_update_delete, name="elonlar-detail"),
    path("filiallar/", filiallar_list_create, name="filiallar-list-create"),
    path("filiallar/<int:pk>/", filiallar_detail_update_delete, name="filiallar-detail"),
    path("leaders/", leaders_list_create, name="leaders-list-create"),
    path("leaders/<int:pk>/", leader_detail_update_delete, name="leaders-detail"),
    path("narx-navo-products/", narx_navo_list_create, name="narx-navo-products-list-create"),
    path("narx-navo-products/<int:pk>/", narx_navo_detail_update_delete, name="narx-navo-products-detail"),
    path("vacancies/", vacancies_list_create, name="vacancies-list-create"),
    path("vacancies/<int:pk>/", vacancies_detail_update_delete, name="vacancies-detail"),
    path("catalog-items/", catalog_items_list_create, name="catalog-items-list-create"),
    path("catalog-items/<int:pk>/", catalog_item_detail_update_delete, name="catalog-items-detail"),
    path("home-content/", home_content_update, name="home-content-update"),
    path("contact-settings/", contact_settings_update, name="contact-settings-update"),
    path("announcement-settings/", announcement_settings_update, name="announcement-settings-update"),
]

