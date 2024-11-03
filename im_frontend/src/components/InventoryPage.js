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
import { Link, useNavigate } from "react-router-dom";
import {
  fetchInventories,
  createInventory,
  updateInventory,
  deleteInventory,
  fetchProducts,
  fetchWarehouses,
} from "../services/api";
import defaultProductImage from "../images/default.jpg";

const InventoryPage = ({onLogout}) => {
  const [inventories, setInventories] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [editId, setEditId] = useState(null);
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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [inventoryData, productData, warehouseData] = await Promise.all([
        fetchInventories(),
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


  return (
    <>
      <TableContainer component={Paper}>
      <h1><center>Inventory Management</center></h1>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell>Logistic Codification</TableCell>
              <TableCell>Inventory Date</TableCell>
              <TableCell>Inventory on Hand</TableCell>
              <TableCell>Value per Unit</TableCell>
              <TableCell>Inventory on Hand Value</TableCell>
              <TableCell>In Progress Delivery</TableCell>
              <TableCell>Total Predicted Inventory</TableCell>
              <TableCell>Total Predicted Inventory Value</TableCell>
              <TableCell>Actions</TableCell>
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
                    onChange={handleNewInventoryChange}
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
                  </Select>
                </FormControl>
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
                <Button onClick={handleAddNewInventory} startIcon={<Add/>}>
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        onClick={onLogout}
        color="secondary"
      >
        Logout
      </Button>
    </>
  );
};

export default InventoryPage;
