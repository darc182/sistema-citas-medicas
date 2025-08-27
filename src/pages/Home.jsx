import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container-fluid p-0">
      <div className="py-5" style={{ 
        background: 'linear-gradient(135deg, #0062E6, #33AEFF)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="display-3 fw-bold text-white mb-4">Sistema de Citas Médicas</h1>
              <p className="lead text-white mb-4">
                Una plataforma integral para la gestión de citas médicas, que permite administrar 
                pacientes, doctores y programar citas de manera eficiente y segura.
              </p>
              <Link to="/login" className="btn btn-light btn-lg px-5 py-3 rounded-pill">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </Link>
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div className="card border-0 shadow-lg rounded-4" style={{ maxWidth: '450px' }}>
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <div className="bg-primary text-white rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                      <i className="bi bi-hospital" style={{ fontSize: '2rem' }}></i>
                    </div>
                    <h3 className="fw-bold">Sistema Médico Integral</h3>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item border-0 py-3 d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <i className="bi bi-person-heart text-primary"></i>
                      </div>
                      <span>Gestión completa de pacientes</span>
                    </li>
                    <li className="list-group-item border-0 py-3 d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <i className="bi bi-person-badge text-primary"></i>
                      </div>
                      <span>Administración de doctores</span>
                    </li>
                    <li className="list-group-item border-0 py-3 d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <i className="bi bi-calendar-check text-primary"></i>
                      </div>
                      <span>Programación de citas médicas</span>
                    </li>
                    <li className="list-group-item border-0 py-3 d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-3">
                        <i className="bi bi-clipboard-data text-primary"></i>
                      </div>
                      <span>Historiales y reportes clínicos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-lightning text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4>Eficiencia</h4>
                <p className="text-muted">Agilice la programación de citas y optimice la gestión de su consultorio médico.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-shield-check text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4>Confidencialidad</h4>
                <p className="text-muted">Información médica protegida con los más altos estándares de privacidad y seguridad.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-phone text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4>Accesible</h4>
                <p className="text-muted">Acceda al sistema desde cualquier dispositivo para gestionar citas en tiempo real.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
