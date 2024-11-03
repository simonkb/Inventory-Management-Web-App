from django.contrib import admin
from .models import Supplier, Product, ProductVariation, Warehouse, Inventory

admin.site.register(Supplier)
admin.site.register(Product)
admin.site.register(ProductVariation)
admin.site.register(Warehouse)
admin.site.register(Inventory)
