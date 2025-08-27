import axios from 'axios';

// Esta constante se puede cambiar fácilmente cuando el backend esté disponible
export const API_BASE_URL = 'http://localhost:8000/api';

// Crear una instancia de axios con configuración por defecto
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a todas las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicios genéricos CRUD para cualquier entidad
export const apiService = {
  // GET - Listar todos los recursos
  getAll: async (resource) => {
    try {
      const response = await apiClient.get(`/${resource}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      throw error;
    }
  },
  
  // GET - Obtener un recurso por ID
  getById: async (resource, id) => {
    try {
      const response = await apiClient.get(`/${resource}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${resource} with id ${id}:`, error);
      throw error;
    }
  },
  
  // POST - Crear un nuevo recurso
  create: async (resource, data) => {
    try {
      const response = await apiClient.post(`/${resource}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },
  
  // PUT - Actualizar un recurso existente
  update: async (resource, id, data) => {
    try {
      const response = await apiClient.put(`/${resource}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${resource} with id ${id}:`, error);
      throw error;
    }
  },
  
  // DELETE - Eliminar un recurso
  delete: async (resource, id) => {
    try {
      const response = await apiClient.delete(`/${resource}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${resource} with id ${id}:`, error);
      throw error;
    }
  },
  
  // Servicio de autenticación
  auth: {
    login: async (credentials) => {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
      } catch (error) {
        console.error('Error during login:', error);
        throw error;
      }
    },
    
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    getCurrentUser: () => {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated: () => {
      return localStorage.getItem('token') !== null;
    }
  }
};

export default apiService;
