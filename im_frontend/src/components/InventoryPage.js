import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
} from "@mui/material";
import { Add, Delete, Edit, Save, Cancel } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createInventory,
  updateInventory,
  deleteInventory,
  fetchProducts,
  fetchWarehouses,
  createWarehouse,
  fetchInventoriesBySupplier,
} from "../services/api";
import defaultProductImage from "../images/default.jpg";

const InventoryPage = ({ onLogout }) => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showNewWarehouseField, setShowNewWarehouseField] = useState(false);
  const [newWarehouseName, setNewWarehouseName] = useState("");

  const [newInventory, setNewInventory] = useState({
    product: "",
    warehouse: "",
    logistic_codification: "",
    inventory_date: "",
    inventory_on_hand: 0,
    value_per_unit: 0,
    inventory_on_hand_value: 0,
    in_progress_delivery: 0,
    total_predicted_inventory: 0,
    total_predicted_inventory_value: 0,
  });
  const navigate = useNavigate();
  const { clientId } = useParams();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [inventoryData, productData, warehouseData] = await Promise.all([
        fetchInventoriesBySupplier(clientId),
        fetchProducts(),
        fetchWarehouses(),
      ]);

      const productMap = Object.fromEntries(
        productData.data.map((p) => [p.id, p.name])
      );
      const warehouseMap = Object.fromEntries(
        warehouseData.data.map((w) => [w.id, w.name])
      );

      const inventoriesWithNames = inventoryData.data.map((inventory) => ({
        ...inventory,
        productName: productMap[inventory.product],
        warehouseName: warehouseMap[inventory.warehouse],
      }));

      setInventories(inventoriesWithNames);
      setProducts(productData.data);
      setWarehouses(warehouseData.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleEdit = (id) => setEditId(id);
  const handleCancelEdit = () => setEditId(null);
  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setInventories((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, [name]: value } : inv))
    );
  };

  const handleSave = async (inventory) => {
    try {
      if (editId) {
        await updateInventory(editId, inventory);
      } else {
        await createInventory(inventory);
      }
      loadData();
      setEditId(null);
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  const handleDelete = async (id) => {
    await deleteInventory(id);
    loadData();
  };

  const handleNewInventoryChange = (e) => {
    const { name, value } = e.target;
    setNewInventory((prev) => ({ ...prev, [name]: value }));
  };
  const handleProductChange = (e) => {
    const selectedProduct = e.target.value;

    if (selectedProduct === "add_new") {
      navigate("/add-product");
    } else {
      setNewInventory((prev) => ({ ...prev, product: selectedProduct }));
    }
  };

  const handleAddNewInventory = async () => {
    if (!newInventory.product || !newInventory.warehouse) {
      alert("Product and Warehouse fields are required.");
      return;
    }

    try {
      await createInventory(newInventory);
      setNewInventory({
        product: "",
        warehouse: "",
        logistic_codification: "",
        inventory_date: "",
        inventory_on_hand: 0,
        value_per_unit: 0,
        inventory_on_hand_value: 0,
        in_progress_delivery: 0,
        total_predicted_inventory: 0,
        total_predicted_inventory_value: 0,
      });
      loadData();
    } catch (error) {
      console.error("Error adding new inventory:", error);
    }
  };
  const handleWarehouseChange = (e) => {
    const selectedWarehouse = e.target.value;
    if (selectedWarehouse === "add_new") {
      setShowNewWarehouseField(true);
    } else {
      setShowNewWarehouseField(false);
      setNewInventory((prev) => ({ ...prev, warehouse: selectedWarehouse }));
    }
  };
  const handleAddNewWarehouse = async () => {
    if (newWarehouseName.trim()) {
      try {
        const response = await createWarehouse({ name: newWarehouseName });
        setWarehouses((prev) => [...prev, response.data]);
        setNewInventory((prev) => ({ ...prev, warehouse: response.data.id }));
        setNewWarehouseName("");
        setShowNewWarehouseField(false);
      } catch (error) {
        console.error("Error adding new warehouse:", error);
      }
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <h1>
          <center>Inventory Management</center>
        </h1>

        <Table>
          <TableHead>
            
            <TableRow>
              {[
                "Product",
                "Warehouse",
                "Logistic Codification",
                "Inventory Date",
                "Inventory on Hand",
                "Value per Unit",
                "Inventory on Hand Value",
                "In Progress Delivery",
                "Total Predicted Inventory",
                "Total Predicted Inventory Value",
                "Actions",
              ].map((header) => (
                <TableCell key={header} sx={headerCellStyle}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {inventories.map((inventory) => (
              <TableRow key={inventory.id}>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={defaultProductImage}
                      alt="Product"
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "10px",
                        borderRadius: "5px",
                      }}
                    />
                    {editId === inventory.id ? (
                      <FormControl fullWidth>
                        <Select
                          name="product"
                          value={inventory.product}
                          onChange={(e) => handleChange(e, inventory.id)}
                        >
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Link to={`/product/${inventory.product}`}>
                        {inventory.productName}
                      </Link>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <FormControl fullWidth>
                      <Select
                        name="warehouse"
                        value={inventory.warehouse}
                        onChange={(e) => handleChange(e, inventory.id)}
                      >
                        {warehouses.map((warehouse) => (
                          <MenuItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    inventory.warehouseName
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <TextField
                      name="logistic_codification"
                      type="text"
                      value={inventory.logistic_codification}
                      onChange={(e) => handleChange(e, inventory.id)}
                    />
                  ) : (
                    inventory.logistic_codification
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <TextField
                      name="inventory_date"
                      type="date"
                      value={inventory.inventory_date}
                      onChange={(e) => handleChange(e, inventory.id)}
                    />
                  ) : (
                    inventory.inventory_date
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <TextField
                      name="inventory_on_hand"
                      type="number"
                      value={inventory.inventory_on_hand}
                      onChange={(e) => handleChange(e, inventory.id)}
                    />
                  ) : (
                    inventory.inventory_on_hand
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <TextField
                      name="value_per_unit"
                      type="number"
                      value={inventory.value_per_unit}
                      onChange={(e) => handleChange(e, inventory.id)}
                    />
                  ) : (
                    inventory.value_per_unit
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <TextField
                      name="inventory_on_hand_value"
                      type="number"
                      value={inventory.inventory_on_hand_value}
                      onChange={(e) => handleChange(e, inventory.id)}
                    />
                  ) : (
                    inventory.inventory_on_hand_value
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <TextField
                      name="in_progress_delivery"
                      type="number"
                      value={inventory.in_progress_delivery}
                      onChange={(e) => handleChange(e, inventory.id)}
                    />
                  ) : (
                    inventory.in_progress_delivery
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <TextField
                      name="total_predicted_inventory"
                      type="number"
                      value={inventory.total_predicted_inventory}
                      onChange={(e) => handleChange(e, inventory.id)}
                    />
                  ) : (
                    inventory.total_predicted_inventory
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <TextField
                      name="total_predicted_inventory_value"
                      type="number"
                      value={inventory.total_predicted_inventory_value}
                      onChange={(e) => handleChange(e, inventory.id)}
                    />
                  ) : (
                    inventory.total_predicted_inventory_value
                  )}
                </TableCell>
                <TableCell>
                  {editId === inventory.id ? (
                    <>
                      <IconButton onClick={() => handleSave(inventory)}>
                        <Save />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit}>
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(inventory.id)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(inventory.id)}>
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    name="product"
                    value={newInventory.product}
                    onChange={handleProductChange}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Product</em>
                    </MenuItem>
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="add_new" color="primary">
                      + New Product
                    </MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <FormControl fullWidth>
                  <Select
                    name="warehouse"
                    value={newInventory.warehouse}
                    onChange={handleWarehouseChange}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Warehouse</em>
                    </MenuItem>
                    {warehouses.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="add_new" color="primary">
                      + New Warehouse
                    </MenuItem>
                  </Select>
                </FormControl>
                {showNewWarehouseField && (
                  <div>
                    <TextField
                      label="New Warehouse Name"
                      value={newWarehouseName}
                      onChange={(e) => setNewWarehouseName(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddNewWarehouse}
                    >
                      Add Warehouse
                    </Button>
                  </div>
                )}
              </TableCell>

              <TableCell>
                <TextField
                  name="logistic_codification"
                  type="text"
                  value={newInventory.logistic_codification}
                  onChange={handleNewInventoryChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="inventory_date"
                  type="date"
                  value={newInventory.inventory_date}
                  onChange={handleNewInventoryChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="inventory_on_hand"
                  type="number"
                  value={newInventory.inventory_on_hand}
                  onChange={handleNewInventoryChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="value_per_unit"
                  type="number"
                  value={newInventory.value_per_unit}
                  onChange={handleNewInventoryChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="inventory_on_hand_value"
                  type="number"
                  value={newInventory.inventory_on_hand_value}
                  onChange={handleNewInventoryChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="in_progress_delivery"
                  type="number"
                  value={newInventory.in_progress_delivery}
                  onChange={handleNewInventoryChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="total_predicted_inventory"
                  type="number"
                  value={newInventory.total_predicted_inventory}
                  onChange={handleNewInventoryChange}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="total_predicted_inventory_value"
                  type="number"
                  value={newInventory.total_predicted_inventory_value}
                  onChange={handleNewInventoryChange}
                />
              </TableCell>
              <TableCell>
                <Button onClick={handleAddNewInventory} startIcon={<Add />}>
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          navigate(-1);
        }}
        style={{ margin: 16 }}
      >
        Back
      </Button>

      <Button
        variant="contained"
        onClick={onLogout}
        color="secondary"
        style={{ margin: 16 }}
      >
        Logout
      </Button>
    </>
  );
};
const headerCellStyle = {
  color: "#000",
  fontWeight: "bold",
  fontSize: "1rem",
  textAlign: "center",
  
};

export default InventoryPage;
