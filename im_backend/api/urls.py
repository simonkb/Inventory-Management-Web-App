from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, ProductViewSet, ProductVariationViewSet, WarehouseViewSet, InventoryViewSet, InventoryBySupplierView

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)
router.register(r'products', ProductViewSet)
router.register(r'product-variations', ProductVariationViewSet)
router.register(r'warehouses', WarehouseViewSet)
router.register(r'inventory', InventoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('inventories/by-client/<int:client_id>/', InventoryBySupplierView.as_view(), name='inventory-by-client'),
    
]
