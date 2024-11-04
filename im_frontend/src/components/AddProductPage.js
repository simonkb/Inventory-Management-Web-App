import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Paper,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  fetchProductVariations,
  createProduct,
  createProductVariation,
  fetchSuppliers,
  createSupplier,
} from "../services/api";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    internal_code: "",
    product_type: "",
    universe: "",
    product_variation: "",
    supplier: "",
  });
  const [productVariations, setProductVariations] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newVariation, setNewVariation] = useState({
    product_type: "",
    variation: "",
    program_time: "",
    posology: "",
    variation_code: "",
    variation_description: "",
  });
  const [newSupplier, setNewSupplier] = useState(null);

  useEffect(() => {
    loadProductVariations();
    loadSuppliers();
  }, []);

  const loadProductVariations = async () => {
    const response = await fetchProductVariations();
    setProductVariations(response.data);
  };

  const loadSuppliers = async () => {
    const response = await fetchSuppliers();
    setSuppliers(response.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    let variationId = product.product_variation;
    let supplierId = product.supplier;

    if (newVariation && variationId === "add_new") {
      const response = await createProductVariation(newVariation);
      variationId = response.data.id;
    }

    if (newSupplier) {
      const response = await createSupplier(newSupplier);
      supplierId = response.data.id;
    }

    await createProduct({
      ...product,
      product_variation: variationId,
      supplier: supplierId,
    });
    navigate(-1);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Paper style={{ padding: 16 }}>
      <h2>Add New Product</h2>
      <TextField
        label="Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="SKU"
        name="sku"
        value={product.sku}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Internal Code"
        name="internal_code"
        value={product.internal_code}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Product Type"
        name="product_type"
        value={product.product_type}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Universe"
        name="universe"
        value={product.universe}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      {/* Product Variation Selection */}
      <FormControl fullWidth margin="normal">
        <Select
          name="product_variation"
          value={product.product_variation}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="">
            <em>Product Variation</em>
          </MenuItem>
          {productVariations.map((variation) => (
            <MenuItem key={variation.id} value={variation.id}>
              {variation.variation_description}
            </MenuItem>
          ))}
          <MenuItem value="add_new">Add New Variation</MenuItem>
        </Select>
      </FormControl>

      {product.product_variation === "add_new" && (
        <div>
          <h4>New Variation Details</h4>
          <TextField
            label="Product Type"
            name="product_type"
            value={newVariation.product_type}
            onChange={(e) =>
              setNewVariation((prev) => ({
                ...prev,
                product_type: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Variation"
            name="variation"
            value={newVariation.variation}
            onChange={(e) =>
              setNewVariation((prev) => ({
                ...prev,
                variation: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Program Time"
            name="program_time"
            value={newVariation.program_time}
            onChange={(e) =>
              setNewVariation((prev) => ({
                ...prev,
                program_time: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Posology"
            name="posology"
            value={newVariation.posology}
            onChange={(e) =>
              setNewVariation((prev) => ({
                ...prev,
                posology: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Variation Code"
            name="variation_code"
            value={newVariation.variation_code}
            onChange={(e) =>
              setNewVariation((prev) => ({
                ...prev,
                variation_code: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Variation Description"
            name="variation_description"
            value={newVariation.variation_description}
            onChange={(e) =>
              setNewVariation((prev) => ({
                ...prev,
                variation_description: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
        </div>
      )}

      <FormControl fullWidth margin="normal">
        <Select
          name="supplier"
          value={product.supplier}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="">
            <em>Select Supplier</em>
          </MenuItem>
          {suppliers.map((supplier) => (
            <MenuItem key={supplier.id} value={supplier.id}>
              {supplier.name}
            </MenuItem>
          ))}
          <MenuItem value="add_new">Add New Supplier</MenuItem>
        </Select>
      </FormControl>

      {product.supplier === "add_new" && (
        <div>
          <h4>New Supplier Details</h4>
          <TextField
            label="Supplier Name"
            name="name"
            value={newSupplier?.name || ""}
            onChange={(e) =>
              setNewSupplier((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact Information"
            name="contact_info"
            value={newSupplier?.contact_info || ""}
            onChange={(e) =>
              setNewSupplier((prev) => ({
                ...prev,
                contact_info: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        style={{ marginTop: 16 }}
      >
        Save Product
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleCancel}
        style={{ marginTop: 16, marginLeft: 16 }}
      >
        Cancel
      </Button>
    </Paper>
  );
};

export default AddProductPage;
