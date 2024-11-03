import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Card, CardContent, Typography, Box, Alert } from '@mui/material';
import { login, setAuthToken } from '../services/api';

const LoginPage = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { access } = await login(username, password);

      localStorage.setItem('token', access);
      
      setAuthToken(access);

      setIsAuthenticated(true);

      navigate('/inventory');
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', padding: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Login to Inventory Management
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
