import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const Doctores = () => {
  const { user } = useContext(AuthContext);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' o 'cards'
  const [searchTerm, setSearchTerm] = useState('');
  
  // Helper para formatear el horario de atención
  const formatHorarioAtencion = (horario) => {
    if (!horario || typeof horario !== 'object') {
      return 'Horario no definido';
    }
    
    const diasSpanish = {
      'lunes': 'Lun',
      'martes': 'Mar', 
      'miercoles': 'Mié',
      'jueves': 'Jue',
      'viernes': 'Vie',
      'sabado': 'Sáb',
      'domingo': 'Dom'
    };
    
    const dias = Object.keys(horario).map(dia => diasSpanish[dia] || dia);
    return `${dias.join(', ')}`;
  };
  
  // Estado para el formulario
  const [currentDoctor, setCurrentDoctor] = useState({
    id: null,
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    especialidad: '',
    numero_licencia: '',
    universidad: '',
    experiencia_anos: 0,
    consulta_precio: 0,
    horario_atencion: null,
    dias_disponibles: [],
    disponible: true
  });
  
  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAll('doctores');
        setDoctores(response.doctores || []); // response.doctores del backend
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar doctores:', err);
        setError('Error al cargar los datos de doctores');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrar doctores por término de búsqueda
  const filteredDoctores = doctores.filter(doctor => {
    return (
      doctor.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.especialidad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.cedula?.includes(searchTerm)
    );
  });

  // Manejadores del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor({
      ...currentDoctor,
      [name]: value
    });
  };

  const resetForm = () => {
    setCurrentDoctor({
      id: null,
      nombre: '',
      apellido: '',
      cedula: '',
      email: '',
      telefono: '',
      especialidad: '',
      numero_licencia: '',
      universidad: '',
      experiencia_anos: 0,
      consulta_precio: 0,
      horario_atencion: null,
      dias_disponibles: [],
      disponible: true
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (isEditing) {
        // Actualizar un doctor existente
        const response = await apiService.update('doctores', currentDoctor.id, currentDoctor);
        const updatedDoctores = doctores.map(doctor => 
          doctor.id === currentDoctor.id ? response.doctor : doctor
        );
        setDoctores(updatedDoctores);
      } else {
        // Crear un nuevo doctor
        const response = await apiService.create('doctores', currentDoctor);
        setDoctores([...doctores, response.doctor]);
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Error al guardar doctor:', err);
      setError(err.message || 'Error al guardar el doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setCurrentDoctor(doctor);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este doctor?')) {
      try {
        setLoading(true);
        await apiService.delete('doctores', id);
        setDoctores(doctores.filter(doctor => doctor.id !== id));
        setError(null);
      } catch (err) {
        console.error('Error al eliminar doctor:', err);
        setError(err.message || 'Error al eliminar el doctor');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="bg-light rounded-3 p-4 mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1">
              <i className="bi bi-person-badge me-2 text-primary"></i>
              Gestión de Doctores
            </h2>
            <p className="text-muted mb-0">
              <i className="bi bi-person-circle me-1"></i>
              Bienvenido, {user.nombre} {user.apellido}
            </p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => { setShowForm(!showForm); setIsEditing(false); }}
          >
            <i className={`bi ${showForm ? 'bi-dash-circle' : 'bi-plus-circle'} me-2`}></i>
            {showForm ? 'Cerrar Formulario' : 'Nuevo Doctor'}
          </button>
        </div>
        
        {/* Barra de búsqueda y herramientas */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar doctores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('table')}
              >
                <i className="bi bi-table me-1"></i> Tabla
              </button>
              <button 
                type="button" 
                className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('cards')}
              >
                <i className="bi bi-grid-3x3-gap me-1"></i> Tarjetas
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Formulario para crear/editar */}
      {showForm && (
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
              {isEditing ? 'Editar Doctor' : 'Nuevo Doctor'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre"
                      value={currentDoctor.nombre}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="nombre">Nombre *</label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      name="apellido"
                      placeholder="Apellido"
                      value={currentDoctor.apellido}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="apellido">Apellido *</label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="cedula"
                      name="cedula"
                      placeholder="Cédula"
                      value={currentDoctor.cedula}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="cedula">Cédula *</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Email"
                      value={currentDoctor.email}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="email">Email *</label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      placeholder="Teléfono"
                      value={currentDoctor.telefono}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="telefono">Teléfono</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-control"
                      id="especialidad"
                      name="especialidad"
                      value={currentDoctor.especialidad}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Cardiología">Cardiología</option>
                      <option value="Pediatría">Pediatría</option>
                      <option value="Dermatología">Dermatología</option>
                      <option value="Ginecología">Ginecología</option>
                      <option value="Neurología">Neurología</option>
                      <option value="Oftalmología">Oftalmología</option>
                      <option value="Traumatología">Traumatología</option>
                      <option value="Medicina General">Medicina General</option>
                      <option value="Psiquiatría">Psiquiatría</option>
                      <option value="Radiología">Radiología</option>
                    </select>
                    <label htmlFor="especialidad">Especialidad *</label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="numero_licencia"
                      name="numero_licencia"
                      placeholder="Número de Licencia"
                      value={currentDoctor.numero_licencia}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="numero_licencia">Número de Licencia *</label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="universidad"
                      name="universidad"
                      placeholder="Universidad"
                      value={currentDoctor.universidad}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="universidad">Universidad</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="horario_atencion"
                      name="horario_atencion"
                      placeholder="Horario de Atención"
                      value={currentDoctor.horario_atencion || ''}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="horario_atencion">Horario de Atención</label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="experiencia_anos"
                      name="experiencia_anos"
                      placeholder="Años de Experiencia"
                      value={currentDoctor.experiencia_anos || 0}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="experiencia_anos">Años de Experiencia</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="consulta_precio"
                      name="consulta_precio"
                      placeholder="Precio de Consulta"
                      value={currentDoctor.consulta_precio || 0}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="consulta_precio">Precio de Consulta ($)</label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-check form-switch mt-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="disponible"
                      name="disponible"
                      checked={currentDoctor.disponible}
                      onChange={(e) => setCurrentDoctor(prev => ({ ...prev, disponible: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="disponible">
                      Doctor Disponible
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary d-flex align-items-center">
                  <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-save'} me-2`}></i>
                  {isEditing ? 'Actualizar' : 'Guardar'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={resetForm}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Vista de tabla */}
      {viewMode === 'table' && (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="py-3">ID</th>
                    <th scope="col" className="py-3">Doctor</th>
                    <th scope="col" className="py-3">Especialidad</th>
                    <th scope="col" className="py-3">Precio</th>
                    <th scope="col" className="py-3">Experiencia</th>
                    <th scope="col" className="py-3">Contacto</th>
                    <th scope="col" className="py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctores.length > 0 ? (
                    filteredDoctores.map(doctor => (
                      <tr key={doctor.id}>
                        <td>{doctor.id}</td>
                        <td>
                          <div>
                            <strong>{doctor.nombre} {doctor.apellido}</strong>
                            <br />
                            <small className="text-muted">Lic. {doctor.numero_licencia}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary">{doctor.especialidad}</span>
                        </td>
                        <td>${doctor.consulta_precio || 0}</td>
                        <td>{doctor.experiencia_anos || 0} años</td>
                        <td>
                          <div>
                            <small>{doctor.email}</small>
                            <br />
                            <small className="text-muted">{doctor.telefono}</small>
                          </div>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(doctor)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(doctor.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        {searchTerm ? 
                          <div>
                            <i className="bi bi-search fs-4 d-block mb-2"></i>
                            No se encontraron resultados para "{searchTerm}"
                          </div> 
                          : 
                          <div>
                            <i className="bi bi-person-x fs-4 d-block mb-2"></i>
                            No hay doctores disponibles
                          </div>
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Vista de tarjetas */}
      {viewMode === 'cards' && (
        <div className="row g-4">
          {filteredDoctores.length > 0 ? (
            filteredDoctores.map(doctor => (
              <div key={doctor.id} className="col-sm-6 col-lg-4 col-xl-3">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <span className="badge bg-primary rounded-pill">{doctor.especialidad}</span>
                    <span className="badge bg-success rounded-pill">${doctor.consulta_precio || 0}</span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{doctor.nombre} {doctor.apellido}</h5>
                    <p className="card-text text-muted mb-2">
                      <i className="bi bi-shield-check me-1"></i>
                      Lic. {doctor.numero_licencia}
                    </p>
                    <p className="card-text text-muted mb-2">
                      <i className="bi bi-clock me-1"></i>
                      {formatHorarioAtencion(doctor.horario_atencion)}
                    </p>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">
                          <i className="bi bi-calendar-check me-1"></i>
                          {doctor.experiencia_anos || 0} años exp.
                        </span>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted d-block">{doctor.email}</small>
                        <small className="text-muted">{doctor.telefono}</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-grid gap-2">
                      <div className="btn-group">
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={() => handleEdit(doctor)}
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Editar
                        </button>
                        <button
                          className="btn btn-outline-danger w-100"
                          onClick={() => handleDelete(doctor.id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              {searchTerm ? 
                <div>
                  <i className="bi bi-search fs-1 d-block mb-3 text-muted"></i>
                  <h5>No se encontraron resultados para "{searchTerm}"</h5>
                </div> 
                : 
                <div>
                  <i className="bi bi-person-x fs-1 d-block mb-3 text-muted"></i>
                  <h5>No hay doctores disponibles</h5>
                </div>
              }
            </div>
          )}
        </div>
      )}
      
      {/* Resumen y estadísticas */}
      <div className="mt-4 row g-3">
        <div className="col-md-3">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Total Doctores</h5>
                <small className="opacity-75">Personal médico</small>
              </div>
              <div className="fs-2 fw-bold">{filteredDoctores.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Especialidades</h5>
                <small className="opacity-75">Áreas médicas</small>
              </div>
              <div className="fs-2 fw-bold">
                {[...new Set(filteredDoctores.map(d => d.especialidad))].length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Experiencia Promedio</h5>
                <small className="opacity-75">Años de práctica</small>
              </div>
              <div className="fs-2 fw-bold">
                {filteredDoctores.length > 0 ? Math.round(filteredDoctores.reduce((sum, d) => sum + parseInt(d.experiencia_anos || 0), 0) / filteredDoctores.length) : 0}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Disponibles</h5>
                <small className="opacity-75">Doctores activos</small>
              </div>
              <div className="fs-2 fw-bold">
                {filteredDoctores.filter(d => d.disponible).length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctores;
