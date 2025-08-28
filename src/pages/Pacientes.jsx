import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const Pacientes = () => {
  const { user } = useContext(AuthContext);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el formulario
  const [currentPaciente, setCurrentPaciente] = useState({
    id: null,
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    direccion: '',
    tipo_sangre: '',
    alergias: '',
    enfermedades_cronicas: '',
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: ''
  });
  
  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPacientes();
        setPacientes(response);
        setError(null);
      } catch (err) {
        console.error('Error al cargar pacientes:', err);
        setError('Error al cargar los pacientes: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  // Manejadores del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPaciente({
      ...currentPaciente,
      [name]: value
    });
  };

  const resetForm = () => {
    setCurrentPaciente({
      id: null,
      nombre: '',
      apellido: '',
      cedula: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: '',
      direccion: '',
      tipo_sangre: '',
      alergias: '',
      enfermedades_cronicas: '',
      contacto_emergencia_nombre: '',
      contacto_emergencia_telefono: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      if (isEditing) {
        // Actualizar un paciente existente
        const updatedPaciente = await apiService.updatePaciente(currentPaciente.id, currentPaciente);
        const updatedPacientes = pacientes.map(paciente => 
          paciente.id === currentPaciente.id ? updatedPaciente : paciente
        );
        setPacientes(updatedPacientes);
      } else {
        // Crear un nuevo paciente
        const newPaciente = await apiService.createPaciente(currentPaciente);
        setPacientes([...pacientes, newPaciente]);
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Error al guardar paciente:', err);
      setError('Error al guardar el paciente: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (paciente) => {
    setCurrentPaciente(paciente);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este paciente?')) {
      try {
        setLoading(true);
        await apiService.deletePaciente(id);
        const updatedPacientes = pacientes.filter(paciente => paciente.id !== id);
        setPacientes(updatedPacientes);
        setError(null);
      } catch (err) {
        console.error('Error al eliminar paciente:', err);
        setError('Error al eliminar el paciente: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    }
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col">
          <h2><i className="bi bi-person-heart me-2"></i>Gestión de Pacientes</h2>
          <p className="text-muted">Bienvenido, {user.nombre} {user.apellido}</p>
        </div>
      </div>
      
      {/* Formulario para crear/editar */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
              {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={currentPaciente.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      name="apellido"
                      value={currentPaciente.apellido}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="cedula" className="form-label">Cédula/Identificación *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cedula"
                      name="cedula"
                      value={currentPaciente.cedula}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={currentPaciente.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={currentPaciente.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha_nacimiento"
                      name="fecha_nacimiento"
                      value={currentPaciente.fecha_nacimiento}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="tipo_sangre" className="form-label">Tipo de Sangre</label>
                    <select
                      className="form-control"
                      id="tipo_sangre"
                      name="tipo_sangre"
                      value={currentPaciente.tipo_sangre}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <textarea
                      className="form-control"
                      id="direccion"
                      name="direccion"
                      rows="2"
                      value={currentPaciente.direccion}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="alergias" className="form-label">Alergias conocidas</label>
                    <textarea
                      className="form-control"
                      id="alergias"
                      name="alergias"
                      rows="2"
                      placeholder="Ej: Penicilina, Mariscos, Ninguna conocida"
                      value={currentPaciente.alergias}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-save'} me-2`}></i>
                    {isEditing ? 'Actualizar' : 'Guardar'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-secondary"
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
        </div>
      </div>
      
      {/* Tabla de pacientes */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header">
              <i className="bi bi-list-ul me-2"></i>
              Lista de Pacientes ({pacientes.length})
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cédula</th>
                      <th>Paciente</th>
                      <th>Edad</th>
                      <th>Contacto</th>
                      <th>Tipo Sangre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pacientes.length > 0 ? (
                      pacientes.map(paciente => (
                        <tr key={paciente.id}>
                          <td>{paciente.id}</td>
                          <td><span className="badge bg-primary">{paciente.cedula}</span></td>
                          <td>
                            <div>
                              <strong>{paciente.nombre} {paciente.apellido}</strong>
                              <br />
                              <small className="text-muted">{paciente.email}</small>
                            </div>
                          </td>
                          <td>{calcularEdad(paciente.fecha_nacimiento)} años</td>
                          <td>{paciente.telefono}</td>
                          <td>
                            {paciente.tipo_sangre && (
                              <span className="badge bg-danger">{paciente.tipo_sangre}</span>
                            )}
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEdit(paciente)}
                                title="Editar paciente"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(paciente.id)}
                                title="Eliminar paciente"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          <i className="bi bi-person-x fs-4 d-block mb-2 text-muted"></i>
                          No hay pacientes registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estadísticas rápidas */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <i className="bi bi-people fs-1 mb-2"></i>
              <h4>{pacientes.length}</h4>
              <p className="mb-0">Total Pacientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <i className="bi bi-gender-male fs-1 mb-2"></i>
              <h4>{pacientes.filter(p => p.genero === 'masculino').length}</h4>
              <p className="mb-0">Hombres</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <i className="bi bi-gender-female fs-1 mb-2"></i>
              <h4>{pacientes.filter(p => p.genero === 'femenino').length}</h4>
              <p className="mb-0">Mujeres</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <i className="bi bi-exclamation-triangle fs-1 mb-2"></i>
              <h4>{pacientes.filter(p => p.alergias && p.alergias !== 'Ninguna conocida').length}</h4>
              <p className="mb-0">Con Alergias</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pacientes;
