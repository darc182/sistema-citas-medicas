import axios from 'axios';

// URL del backend - Sistema de Citas Médicas
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      // El backend devuelve: {status, data: {[resource]: [...], total: number}}
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al obtener datos');
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error);
      throw error;
    }
  },
  
  // GET - Obtener un recurso por ID
  getById: async (resource, id) => {
    try {
      const response = await apiClient.get(`/${resource}/${id}`);
      // El backend devuelve: {status, data: {[resource]: {...}}}
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al obtener el registro');
    } catch (error) {
      console.error(`Error fetching ${resource} with id ${id}:`, error);
      throw error;
    }
  },
  
  // POST - Crear un nuevo recurso
  create: async (resource, data) => {
    try {
      const response = await apiClient.post(`/${resource}`, data);
      // El backend devuelve: {status, message, data: {[resource]: {...}}}
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al crear el registro');
    } catch (error) {
      console.error(`Error creating ${resource}:`, error);
      throw error;
    }
  },
  
  // PUT - Actualizar un recurso existente
  update: async (resource, id, data) => {
    try {
      const response = await apiClient.put(`/${resource}/${id}`, data);
      // El backend devuelve: {status, message, data: {[resource]: {...}}}
      if (response.data.status === 'success') {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Error al actualizar el registro');
    } catch (error) {
      console.error(`Error updating ${resource} with id ${id}:`, error);
      throw error;
    }
  },
  
  // DELETE - Eliminar un recurso
  delete: async (resource, id) => {
    try {
      const response = await apiClient.delete(`/${resource}/${id}`);
      // El backend devuelve: {status, message}
      if (response.data.status === 'success') {
        return response.data;
      }
      throw new Error(response.data.message || 'Error al eliminar el registro');
    } catch (error) {
      console.error(`Error deleting ${resource} with id ${id}:`, error);
      throw error;
    }
  },
  
  // Métodos específicos para cada entidad
  // Doctores
  getDoctores: async () => {
    const data = await apiService.getAll('doctores');
    return data.doctores || data;
  },
  
  createDoctor: async (doctorData) => {
    const data = await apiService.create('doctores', doctorData);
    return data.doctor || data;
  },
  
  updateDoctor: async (id, doctorData) => {
    const data = await apiService.update('doctores', id, doctorData);
    return data.doctor || data;
  },
  
  deleteDoctor: async (id) => {
    return await apiService.delete('doctores', id);
  },
  
  // Pacientes
  getPacientes: async () => {
    const data = await apiService.getAll('pacientes');
    return data.pacientes || data;
  },
  
  createPaciente: async (pacienteData) => {
    const data = await apiService.create('pacientes', pacienteData);
    return data.paciente || data;
  },
  
  updatePaciente: async (id, pacienteData) => {
    const data = await apiService.update('pacientes', id, pacienteData);
    return data.paciente || data;
  },
  
  deletePaciente: async (id) => {
    return await apiService.delete('pacientes', id);
  },
  
  // Citas
  getCitas: async () => {
    const data = await apiService.getAll('citas');
    return data.citas || data;
  },
  
  createCita: async (citaData) => {
    const data = await apiService.create('citas', citaData);
    return data.cita || data;
  },
  
  updateCita: async (id, citaData) => {
    const data = await apiService.update('citas', id, citaData);
    return data.cita || data;
  },
  
  deleteCita: async (id) => {
    return await apiService.delete('citas', id);
  },
  
  // Servicio de autenticación
  auth: {
    login: async (credentials) => {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        
        // Estructura de respuesta del backend: {status, message, data: {user, session}}
        if (response.data.status === 'success' && response.data.data.session.access_token) {
          const { user, session } = response.data.data;
          localStorage.setItem('token', session.access_token);
          localStorage.setItem('refresh_token', session.refresh_token);
          localStorage.setItem('user', JSON.stringify(user));
          
          return {
            success: true,
            user: user,
            token: session.access_token
          };
        }
        
        return {
          success: false,
          message: response.data.message || 'Error en el login'
        };
      } catch (error) {
        console.error('Error during login:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Error de conexión'
        };
      }
    },
    
    register: async (userData) => {
      try {
        const response = await apiClient.post('/auth/register', userData);
        
        return {
          success: response.data.status === 'success',
          message: response.data.message,
          data: response.data.data
        };
      } catch (error) {
        console.error('Error during registration:', error);
        return {
          success: false,
          message: error.response?.data?.message || 'Error de registro'
        };
      }
    },
    
    logout: async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        // Limpiar localStorage siempre
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
      }
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
