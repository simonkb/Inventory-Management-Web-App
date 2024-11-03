from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, ProductViewSet, ProductVariationViewSet, WarehouseViewSet, InventoryViewSet

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)
router.register(r'products', ProductViewSet)
router.register(r'product-variations', ProductVariationViewSet)
router.register(r'warehouses', WarehouseViewSet)
router.register(r'inventory', InventoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
