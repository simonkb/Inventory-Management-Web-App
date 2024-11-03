from rest_framework import viewsets
from .models import Supplier, Product, ProductVariation, Warehouse, Inventory
from .serializers import (
    SupplierSerializer, ProductSerializer, ProductVariationSerializer,
    WarehouseSerializer, InventorySerializer
)

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductVariationViewSet(viewsets.ModelViewSet):
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer

class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
