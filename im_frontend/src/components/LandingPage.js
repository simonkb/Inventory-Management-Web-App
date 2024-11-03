import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
} from "@mui/material"; 
import { fetchSuppliers, createSupplier } from "../services/api";

const LandingPage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [category, setCategory] = useState(null); 
  const [newClient, setNewClient] = useState(""); 

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const response = await fetchSuppliers();
    setSuppliers(response.data);
  };

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  const handleClientClick = (clientId) => {
    navigate(`/inventory/`);
  };

  const handleCreateClient = async () => {
    if (newClient.trim()) {
      const response = await createSupplier({ name: newClient });
      setSuppliers((prev) => [...prev, response.data]);
      setNewClient(""); 
    }
  };

  return (
    <Paper style={{ padding: 24 }}>
      <Typography variant="h4" align="center" gutterBottom>Selct Category      </Typography>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: 100 }}>
        <Button variant="contained" color="primary" onClick={() => handleCategorySelect("Business Owner")}>
          Business Owner
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleCategorySelect("Vendor")}>
          Vendor
        </Button>
      </div>

      {category && (
        <>
          <Typography variant="h5" style={{ marginTop: 24 }}>
            {category} Clients
          </Typography>
          <List>
            {suppliers.map((client) => (
              <ListItem button key={client.id} onClick={() => handleClientClick(client.id)}>
                <ListItemText primary={client.name} />
              </ListItem>
            ))}
          </List>
          <Divider style={{ margin: "16px 0" }} />

          <Typography variant="h6">Add New Client</Typography>
          <TextField
            label="New Client Name"
            value={newClient}
            onChange={(e) => setNewClient(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleCreateClient}>
            Create Client
          </Button>
        </>
      )}
    </Paper>
  );
};

export default LandingPage;
