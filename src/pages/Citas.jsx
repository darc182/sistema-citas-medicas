import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { apiService } from '../services/api';

const Citas = () => {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  
  // Estado para el formulario
  const [currentCita, setCurrentCita] = useState({
    id: null,
    codigo: '',
    paciente_id: '',
    doctor_id: '',
    fecha: '',
    hora: '',
    motivo_consulta: '',
    observaciones: '',
    estado: 'programada',
    tipo_cita: 'consulta',
    precio: 0
  });
  
  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [citasResponse, pacientesResponse, doctoresResponse] = await Promise.all([
          apiService.getCitas(),
          apiService.getPacientes(),
          apiService.getDoctores()
        ]);
        
        setCitas(citasResponse);
        setPacientes(pacientesResponse);
        setDoctores(doctoresResponse);
        setError(null);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper para obtener el nombre del paciente (memoizado)
  const getPacienteNombre = useMemo(() => {
    return (cita) => {
      // Primero intentar usar los datos relacionales de la cita
      if (cita.pacientes) {
        return `${cita.pacientes.nombre} ${cita.pacientes.apellido}`;
      }
      // Fallback a buscar en la lista de pacientes
      const paciente = pacientes.find(p => p.id === cita.paciente_id);
      return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'No disponible';
    };
  }, [pacientes]);

  // Helper para obtener el nombre del doctor (memoizado)
  const getDoctorNombre = useMemo(() => {
    return (cita) => {
      // Primero intentar usar los datos relacionales de la cita
      if (cita.doctores) {
        return `Dr. ${cita.doctores.nombre} ${cita.doctores.apellido}`;
      }
      // Fallback a buscar en la lista de doctores
      const doctor = doctores.find(d => d.id === cita.doctor_id);
      return doctor ? `Dr. ${doctor.nombre} ${doctor.apellido}` : 'No disponible';
    };
  }, [doctores]);

  // Helper para obtener la especialidad del doctor (memoizado)
  const getDoctorEspecialidad = useMemo(() => {
    return (cita) => {
      // Primero intentar usar los datos relacionales de la cita
      if (cita.doctores) {
        return cita.doctores.especialidad;
      }
      // Fallback a buscar en la lista de doctores
      const doctor = doctores.find(d => d.id === cita.doctor_id);
      return doctor ? doctor.especialidad : '';
    };
  }, [doctores]);

  // Filtrar citas con useMemo para optimizar rendimiento
  const filteredCitas = useMemo(() => {
    return citas.filter(cita => {
      const pacienteNombre = getPacienteNombre(cita).toLowerCase();
      const doctorNombre = getDoctorNombre(cita).toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = !searchTerm || 
        (cita.codigo && cita.codigo.toLowerCase().includes(searchLower)) ||
        pacienteNombre.includes(searchLower) ||
        doctorNombre.includes(searchLower) ||
        (cita.motivo_consulta && cita.motivo_consulta.toLowerCase().includes(searchLower));
      
      const matchesEstado = !filterEstado || cita.estado === filterEstado;
      
      return matchesSearch && matchesEstado;
    });
  }, [citas, searchTerm, filterEstado, getPacienteNombre, getDoctorNombre]);

  // Manejadores del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCita({
      ...currentCita,
      [name]: value
    });
  };

  const resetForm = () => {
    setCurrentCita({
      id: null,
      codigo: '',
      paciente_id: '',
      doctor_id: '',
      fecha: '',
      hora: '',
      motivo_consulta: '',
      observaciones: '',
      estado: 'programada',
      tipo_cita: 'consulta',
      precio: 0
    });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Generar código automáticamente si no se proporciona
      const citaData = {
        ...currentCita,
        codigo: currentCita.codigo || `CITA-${Date.now().toString().slice(-6)}`
      };
      
      if (isEditing) {
        // Actualizar una cita existente
        const updatedCita = await apiService.updateCita(citaData.id, citaData);
        const updatedCitas = citas.map(cita => 
          cita.id === citaData.id ? updatedCita : cita
        );
        setCitas(updatedCitas);
      } else {
        // Crear una nueva cita
        const newCita = await apiService.createCita(citaData);
        setCitas([...citas, newCita]);
      }
      
      resetForm();
      setError(null);
    } catch (err) {
      console.error('Error al guardar cita:', err);
      setError('Error al guardar la cita: ' + (err.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cita) => {
    setCurrentCita(cita);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cita?')) {
      try {
        setLoading(true);
        await apiService.deleteCita(id);
        const updatedCitas = citas.filter(cita => cita.id !== id);
        setCitas(updatedCitas);
        setError(null);
      } catch (err) {
        console.error('Error al eliminar cita:', err);
        setError('Error al eliminar la cita: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    }
  };

  // Helper para formatear fecha y hora
  const formatFechaHora = (fecha, hora) => {
    if (!fecha) return 'No programada';
    const fechaObj = new Date(fecha);
    const fechaFormato = fechaObj.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return `${fechaFormato} ${hora || ''}`;
  };

  // Verificar si hay error
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

  // Mostrar loading solo si está cargando y no hay datos
  if (loading && citas.length === 0) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center py-5">
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <h5>Cargando sistema de citas...</h5>
            <p className="text-muted">Por favor espere un momento</p>
          </div>
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
              <i className="bi bi-calendar-check me-2 text-primary"></i>
              Gestión de Citas Médicas
            </h2>
            <p className="text-muted mb-0">
              <i className="bi bi-person-circle me-1"></i>
              Bienvenido, {user?.nombre || 'Usuario'} {user?.apellido || ''}
            </p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => { setShowForm(!showForm); setIsEditing(false); }}
          >
            <i className={`bi ${showForm ? 'bi-dash-circle' : 'bi-plus-circle'} me-2`}></i>
            {showForm ? 'Cerrar Formulario' : 'Nueva Cita'}
          </button>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="row mb-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar citas, pacientes, doctores..."
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
            <select
              className="form-select d-inline-block w-auto me-2"
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="programada">Programada</option>
              <option value="en_curso">En curso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
              <option value="no_asistio">No asistió</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Formulario para crear/editar */}
      {showForm && (
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-header bg-white">
            <h5 className="mb-0">
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-calendar-plus'} me-2`}></i>
              {isEditing ? 'Editar Cita' : 'Nueva Cita Médica'}
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
                      id="codigo"
                      name="codigo"
                      placeholder="Código"
                      value={currentCita.codigo}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="codigo">Código (automático si se deja vacío)</label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      className="form-control"
                      id="fecha"
                      name="fecha"
                      value={currentCita.fecha}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="fecha">Fecha *</label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="form-floating">
                    <input
                      type="time"
                      className="form-control"
                      id="hora"
                      name="hora"
                      value={currentCita.hora}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="hora">Hora *</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-control"
                      id="paciente_id"
                      name="paciente_id"
                      value={currentCita.paciente_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar Paciente</option>
                      {pacientes.map(paciente => (
                        <option key={paciente.id} value={paciente.id}>
                          {paciente.nombre} {paciente.apellido} - {paciente.cedula}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="paciente_id">Paciente *</label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-control"
                      id="doctor_id"
                      name="doctor_id"
                      value={currentCita.doctor_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar Doctor</option>
                      {doctores.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          Dr. {doctor.nombre} {doctor.apellido} - {doctor.especialidad}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="doctor_id">Doctor *</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-control"
                      id="tipo_cita"
                      name="tipo_cita"
                      value={currentCita.tipo_cita}
                      onChange={handleInputChange}
                    >
                      <option value="consulta">Consulta</option>
                      <option value="control">Control</option>
                      <option value="procedimiento">Procedimiento</option>
                      <option value="cirugia">Cirugía</option>
                    </select>
                    <label htmlFor="tipo_cita">Tipo de Cita</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-control"
                      id="estado"
                      name="estado"
                      value={currentCita.estado}
                      onChange={handleInputChange}
                    >
                      <option value="programada">Programada</option>
                      <option value="en_curso">En curso</option>
                      <option value="completada">Completada</option>
                      <option value="cancelada">Cancelada</option>
                      <option value="no_asistio">No asistió</option>
                    </select>
                    <label htmlFor="estado">Estado</label>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="precio"
                      name="precio"
                      placeholder="Precio"
                      value={currentCita.precio || 0}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="precio">Precio ($)</label>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      style={{ height: '100px' }}
                      id="motivo_consulta"
                      name="motivo_consulta"
                      placeholder="Motivo de la consulta"
                      value={currentCita.motivo_consulta}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                    <label htmlFor="motivo_consulta">Motivo de la Consulta *</label>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      style={{ height: '100px' }}
                      id="observaciones"
                      name="observaciones"
                      placeholder="Observaciones adicionales"
                      value={currentCita.observaciones}
                      onChange={handleInputChange}
                    ></textarea>
                    <label htmlFor="observaciones">Observaciones</label>
                  </div>
                </div>
              </div>
              
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary d-flex align-items-center">
                  <i className={`bi ${isEditing ? 'bi-check-circle' : 'bi-save'} me-2`}></i>
                  {isEditing ? 'Actualizar' : 'Programar Cita'}
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
      
      {/* Tabla de citas */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="py-3">Código</th>
                  <th scope="col" className="py-3">Paciente</th>
                  <th scope="col" className="py-3">Doctor</th>
                  <th scope="col" className="py-3">Fecha y Hora</th>
                  <th scope="col" className="py-3">Tipo</th>
                  <th scope="col" className="py-3">Estado</th>
                  <th scope="col" className="py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCitas.length > 0 ? (
                  filteredCitas.slice(0, 50).map(cita => ( // Limitar a 50 citas por página para rendimiento
                    <tr key={cita.id}>
                      <td>
                        <span className="badge bg-primary">
                          {cita.codigo || `CITA-${cita.id?.slice(-6)}`}
                        </span>
                      </td>
                      <td>
                        <div>
                          <strong>{getPacienteNombre(cita)}</strong>
                          <br />
                          <small className="text-muted">
                            <i className="bi bi-card-text me-1"></i>
                            {cita.motivo_consulta ? cita.motivo_consulta.substring(0, 30) : 'Sin motivo'}...
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{getDoctorNombre(cita)}</strong>
                          <br />
                          <small className="text-muted">{getDoctorEspecialidad(cita)}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <i className="bi bi-calendar3 me-1"></i>
                          {formatFechaHora(cita.fecha, cita.hora)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${
                          cita.tipo_cita === 'cirugia' ? 'bg-warning' :
                          cita.tipo_cita === 'procedimiento' ? 'bg-danger' :
                          cita.tipo_cita === 'control' ? 'bg-info' : 'bg-secondary'
                        }`}>
                          {cita.tipo_cita === 'cirugia' ? 'cirugía' : 
                           cita.tipo_cita === 'procedimiento' ? 'procedimiento' :
                           cita.tipo_cita === 'control' ? 'control' : 'consulta'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          cita.estado === 'completada' ? 'bg-success' : 
                          cita.estado === 'programada' ? 'bg-primary' :
                          cita.estado === 'en_curso' ? 'bg-warning' :
                          cita.estado === 'cancelada' ? 'bg-danger' : 'bg-secondary'
                        }`}>
                          {cita.estado === 'programada' ? 'programada' :
                           cita.estado === 'completada' ? 'completada' :
                           cita.estado === 'en_curso' ? 'en curso' :
                           cita.estado === 'cancelada' ? 'cancelada' :
                           cita.estado === 'no_asistio' ? 'no asistió' : cita.estado}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(cita)}
                            title="Editar cita"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(cita.id)}
                            title="Eliminar cita"
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
                      {searchTerm || filterEstado ? 
                        <div>
                          <i className="bi bi-search fs-4 d-block mb-2"></i>
                          No se encontraron citas que coincidan con los filtros
                        </div> 
                        : 
                        <div>
                          <i className="bi bi-calendar-x fs-4 d-block mb-2"></i>
                          No hay citas programadas
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
      
      {filteredCitas.length > 50 && (
        <div className="alert alert-info mt-2">
          <i className="bi bi-info-circle me-2"></i>
          Mostrando las primeras 50 citas de {filteredCitas.length} encontradas. Use los filtros para refinar su búsqueda.
        </div>
      )}
      
      {/* Estadísticas del día */}
      <div className="mt-4 row g-3">
        <div className="col-md-3">
          <div className="card bg-primary text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Total Citas</h5>
                <small className="opacity-75">En el sistema</small>
              </div>
              <div className="fs-2 fw-bold">{filteredCitas.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Completadas</h5>
                <small className="opacity-75">Citas finalizadas</small>
              </div>
              <div className="fs-2 fw-bold">
                {filteredCitas.filter(c => c.estado === 'completada').length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Programadas</h5>
                <small className="opacity-75">Pendientes</small>
              </div>
              <div className="fs-2 fw-bold">
                {filteredCitas.filter(c => c.estado === 'programada').length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white border-0 shadow-sm">
            <div className="card-body d-flex justify-content-between align-items-center py-3">
              <div>
                <h5 className="mb-0">Canceladas</h5>
                <small className="opacity-75">No realizadas</small>
              </div>
              <div className="fs-2 fw-bold">
                {filteredCitas.filter(c => c.estado === 'cancelada').length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Citas;
