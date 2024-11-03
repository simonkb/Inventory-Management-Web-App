import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const login = async (username, password) => {
  const response = await api.post('/token/', { username, password });
  return response.data; 
};

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
  } else {
    delete api.defaults.headers.common['Authorization']; 
  }
};
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/"; 
    }
    return Promise.reject(error);
  }
);

export const fetchInventories = () => api.get("/inventory/");
export const createInventory = (data) => api.post("/inventory/", data);
export const updateInventory = (id, data) => api.put(`/inventory/${id}/`, data);
export const deleteInventory = (id) => api.delete(`/inventory/${id}/`);

export const fetchProducts = () => api.get("/products/");
export const fetchWarehouses = () => api.get("/warehouses/");
export const updateProduct = (id, data) => api.put(`/products/${id}/`, data);
export const fetchProductVariations = () => api.get('/product-variations/');
export const createProductVariation = (data) => api.post('/product-variations/', data);
export const createProduct = (data) => api.post('/products/', data); 

export const fetchSuppliers = () => {
  console.log("Request headers:", api.defaults.headers.common); 

  return api.get('/suppliers/');
};

export const createSupplier = (data) => api.post('/suppliers/', data);

export default api;
