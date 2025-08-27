import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{
      background: 'linear-gradient(to right, #0062E6, #33AEFF)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <i className="bi bi-hospital me-2"></i>
          <span>Sistema de Citas Médicas</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {user ? (
            <>
              <ul className="navbar-nav mx-auto">
                <li className="nav-item mx-1">
                  <Link className="nav-link px-3 py-2 rounded-pill" to="/pacientes">
                    <i className="bi bi-person-heart me-1"></i> Pacientes
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link className="nav-link px-3 py-2 rounded-pill" to="/doctores">
                    <i className="bi bi-person-badge me-1"></i> Doctores
                  </Link>
                </li>
                <li className="nav-item mx-1">
                  <Link className="nav-link px-3 py-2 rounded-pill" to="/citas">
                    <i className="bi bi-calendar-check me-1"></i> Citas
                  </Link>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                <li className="nav-item d-flex align-items-center me-2">
                  <div className="d-flex align-items-center">
                    <div className="avatar bg-light text-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                         style={{width: '32px', height: '32px'}}>
                      <span className="fw-bold">{user.nombre ? user.nombre.charAt(0) : 'U'}</span>
                    </div>
                    <span className="text-white d-none d-sm-inline">Bienvenido, {user.nombre}</span>
                  </div>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-light btn-sm rounded-pill px-3"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    <span className="d-none d-sm-inline">Cerrar Sesión</span>
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link btn btn-outline-light rounded-pill px-4" to="/login">
                  <i className="bi bi-person me-1"></i>
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
