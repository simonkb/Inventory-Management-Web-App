import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, Button, Paper } from "@mui/material";
import { fetchProducts, updateProduct } from "../services/api";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      const response = await fetchProducts();
      const selectedProduct = response.data.find(
        (p) => p.id === parseInt(productId)
      );
      setProduct(selectedProduct);
    };
    loadProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };
  const handleCancel = async ()=>{
    navigate(-1);
  }

  const handleSave = async () => {
    await updateProduct(product.id, product);
    navigate(-1);
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <Paper style={{ padding: 16 }}>
      <h2>Product Details</h2>
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
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        style={{ marginTop: 16 }}
      >
        Save Changes
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

export default ProductDetailPage;
