from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
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
class InventoryBySupplierView(APIView):
    def get(self, request, client_id):
        inventories = Inventory.objects.filter(product__supplier__id=client_id)
        serializer = InventorySerializer(inventories, many=True)
        return Response(serializer.data)
