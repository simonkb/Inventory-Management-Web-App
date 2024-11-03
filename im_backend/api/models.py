from django.db import models

class Supplier(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    info_received = models.BooleanField(default=False)
    control_status = models.CharField(max_length=255, null=True, blank=True)
    

    def __str__(self):
        return self.name

class ProductVariation(models.Model):
    id = models.AutoField(primary_key=True)
    product_type = models.CharField(max_length=50)
    variation = models.CharField(max_length=50)
    program_time = models.CharField(max_length=50)  
    posology = models.CharField(max_length=255)  
    variation_code = models.CharField(max_length=50, unique=True)
    variation_description = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product_type} - {self.variation} ({self.variation_code})"

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=50, unique=True)
    internal_code = models.CharField(max_length=50)
    universe = models.CharField(max_length=50)
    product_type = models.CharField(max_length=50)
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name="products")
    product_variation = models.ForeignKey(ProductVariation, on_delete=models.CASCADE, related_name="products")

    def __str__(self):
        return self.name

class Warehouse(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    logistic_code = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.name

class Inventory(models.Model):
    id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="inventory_items")
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="inventory_items")
    logistic_codification = models.CharField(max_length=50, null=True, blank=True)
    inventory_date = models.DateField(null=True, blank=True)
    inventory_on_hand = models.PositiveIntegerField(null=True, blank=True)
    value_per_unit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    inventory_on_hand_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    in_progress_delivery = models.PositiveIntegerField(null=True, blank=True)
    total_predicted_inventory = models.PositiveIntegerField(null=True, blank=True)
    total_predicted_inventory_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.product.name} in {self.warehouse.name}"
