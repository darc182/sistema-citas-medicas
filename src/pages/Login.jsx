import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!credentials.email || !credentials.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const result = await login(credentials);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(to right, #0062E6, #33AEFF)' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card border-0 shadow-lg rounded-3">
            <div className="card-header p-4 bg-white border-0">
              <h2 className="fw-bold text-center mb-0">Sistema de Gestión</h2>
              <p className="text-center text-muted mt-2 mb-0">Iniciar Sesión</p>
            </div>
            <div className="card-body p-4 px-lg-5">
              
              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Usuario"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email">Usuario / Email</label>
                </div>
                
                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Contraseña"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="password">Contraseña</label>
                </div>
                
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg text-uppercase fw-bold py-3">
                    Ingresar
                  </button>
                </div>
              </form>
              
              <div className="text-center mt-4">
                <small className="text-muted">
                  Credenciales de prueba:<br />
                  <strong>Admin:</strong> admin@clinica.com / admin123<br />
                  <strong>Recepcionista:</strong> recepcion@clinica.com / 123456<br />
                  <strong>Doctor:</strong> dr.mendoza@clinica.com / doctor123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
