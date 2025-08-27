import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

// Componentes
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Pacientes from './pages/Pacientes';
import Doctores from './pages/Doctores';
import Citas from './pages/Citas';

// Contexto
import AuthProvider from './context/AuthContext';

function App() {
  // Cargar Bootstrap JS al montar el componente
  useEffect(() => {
    const loadBootstrapJs = async () => {
      try {
        const bootstrap = await import('bootstrap');
      } catch (error) {
        console.error('Error loading Bootstrap JS:', error);
      }
    };
    
    loadBootstrapJs();
  }, []);

  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        
        <main className="flex-grow-1 py-3">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/pacientes" element={
              <ProtectedRoute>
                <Pacientes />
              </ProtectedRoute>
            } />
            
            <Route path="/doctores" element={
              <ProtectedRoute>
                <Doctores />
              </ProtectedRoute>
            } />
            
            <Route path="/citas" element={
              <ProtectedRoute>
                <Citas />
              </ProtectedRoute>
            } />
            
            {/* Ruta por defecto - redirige a inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="bg-dark text-white text-center py-3">
          <div className="container">
            <p className="m-0">Sistema de Gestión de Citas Médicas &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
