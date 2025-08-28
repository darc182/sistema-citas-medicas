import { createContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar el usuario del localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Función de inicio de sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Usar la API real para el login
      const result = await apiService.auth.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        return { success: true, user: result.user };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      
      const result = await apiService.auth.register(userData);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al registrar usuario' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de cierre de sesión
  const logout = async () => {
    try {
      setLoading(true);
      await apiService.auth.logout();
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return apiService.auth.isAuthenticated();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
