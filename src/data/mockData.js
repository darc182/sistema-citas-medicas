// Datos simulados para usar mientras no hay backend

// Pacientes mock
export const mockPacientes = [
  {
    id: 1,
    cedula: '0923456789',
    nombre: 'Ana María',
    apellido: 'González',
    email: 'ana.gonzalez@example.com',
    telefono: '0991234567',
    fecha_nacimiento: '1985-05-15',
    direccion: 'Av. Principal 123, Guayaquil',
    tipo_sangre: 'O+',
    alergias: 'Penicilina',
    seguro_medico: 'IESS'
  },
  {
    id: 2,
    cedula: '1703456789',
    nombre: 'Carlos Eduardo',
    apellido: 'Ramírez',
    email: 'carlos.ramirez@example.com',
    telefono: '0997654321',
    fecha_nacimiento: '1978-11-22',
    direccion: 'Calle Secundaria 456, Quito',
    tipo_sangre: 'A+',
    alergias: 'Ninguna conocida',
    seguro_medico: 'Particular'
  },
  {
    id: 3,
    cedula: '0102345678',
    nombre: 'María Elena',
    apellido: 'Torres',
    email: 'maria.torres@example.com',
    telefono: '0993456789',
    fecha_nacimiento: '1992-03-08',
    direccion: 'Av. Central 789, Cuenca',
    tipo_sangre: 'B-',
    alergias: 'Látex',
    seguro_medico: 'IESS'
  },
  {
    id: 4,
    cedula: '0604567890',
    nombre: 'José Miguel',
    apellido: 'Vargas',
    email: 'jose.vargas@example.com',
    telefono: '0995678901',
    fecha_nacimiento: '1980-07-12',
    direccion: 'Av. de los Libertadores 321, Riobamba',
    tipo_sangre: 'AB+',
    alergias: 'Mariscos',
    seguro_medico: 'Particular'
  }
];

// Doctores mock
export const mockDoctores = [
  {
    id: 1,
    cedula: '0912345678',
    nombre: 'Dr. Roberto',
    apellido: 'Mendoza',
    email: 'dr.mendoza@clinica.com',
    telefono: '0988765432',
    especialidad: 'Cardiología',
    numero_licencia: 'LIC-001-2020',
    consultorio: 'Consultorio 101',
    horario_atencion: 'Lunes a Viernes 8:00-16:00',
    anos_experiencia: 15,
    universidad: 'Universidad Central del Ecuador'
  },
  {
    id: 2,
    cedula: '1701234567',
    nombre: 'Dra. Patricia',
    apellido: 'Jiménez',
    email: 'dra.jimenez@clinica.com',
    telefono: '0987654321',
    especialidad: 'Pediatría',
    numero_licencia: 'LIC-002-2018',
    consultorio: 'Consultorio 205',
    horario_atencion: 'Lunes a Viernes 9:00-17:00',
    anos_experiencia: 12,
    universidad: 'Pontificia Universidad Católica del Ecuador'
  },
  {
    id: 3,
    cedula: '0101234567',
    nombre: 'Dr. Fernando',
    apellido: 'Castro',
    email: 'dr.castro@clinica.com',
    telefono: '0986543210',
    especialidad: 'Dermatología',
    numero_licencia: 'LIC-003-2019',
    consultorio: 'Consultorio 310',
    horario_atencion: 'Martes a Sábado 10:00-18:00',
    anos_experiencia: 8,
    universidad: 'Universidad de Cuenca'
  },
  {
    id: 4,
    cedula: '0605432109',
    nombre: 'Dra. Carmen',
    apellido: 'Morales',
    email: 'dra.morales@clinica.com',
    telefono: '0985432109',
    especialidad: 'Ginecología',
    numero_licencia: 'LIC-004-2021',
    consultorio: 'Consultorio 150',
    horario_atencion: 'Lunes a Viernes 8:00-14:00',
    anos_experiencia: 10,
    universidad: 'Universidad San Francisco de Quito'
  }
];

// Citas médicas mock
export const mockCitas = [
  {
    id: 1,
    codigo: 'CITA-001',
    id_paciente: 1,
    id_doctor: 1,
    fecha: '2025-08-28',
    hora: '09:00',
    motivo: 'Control cardiológico rutinario',
    estado: 'Programada',
    observaciones: 'Traer resultados de electrocardiograma',
    tipo_cita: 'Control',
    duracion_minutos: 30
  },
  {
    id: 2,
    codigo: 'CITA-002',
    id_paciente: 2,
    id_doctor: 2,
    fecha: '2025-08-29',
    hora: '10:30',
    motivo: 'Consulta por dolor abdominal',
    estado: 'Completada',
    observaciones: 'Paciente refiere molestias después de comidas',
    tipo_cita: 'Consulta',
    duracion_minutos: 45
  },
  {
    id: 3,
    codigo: 'CITA-003',
    id_paciente: 3,
    id_doctor: 3,
    fecha: '2025-08-30',
    hora: '14:00',
    motivo: 'Evaluación de lunar en espalda',
    estado: 'Programada',
    observaciones: 'Revisión dermatológica preventiva',
    tipo_cita: 'Consulta',
    duracion_minutos: 30
  },
  {
    id: 4,
    codigo: 'CITA-004',
    id_paciente: 4,
    id_doctor: 4,
    fecha: '2025-09-02',
    hora: '11:00',
    motivo: 'Control ginecológico anual',
    estado: 'Programada',
    observaciones: 'Control de rutina',
    tipo_cita: 'Control',
    duracion_minutos: 60
  },
  {
    id: 5,
    codigo: 'CITA-005',
    id_paciente: 1,
    id_doctor: 2,
    fecha: '2025-08-26',
    hora: '15:30',
    motivo: 'Consulta por gripe',
    estado: 'Cancelada',
    observaciones: 'Paciente canceló por mejoría',
    tipo_cita: 'Urgencia',
    duracion_minutos: 20
  }
];

// Usuarios mock del sistema
export const mockUsers = [
  {
    id: 1,
    nombre: 'Administrador',
    apellido: 'Sistema',
    email: 'admin@clinica.com',
    password: 'admin123',
    rol: 'administrador'
  },
  {
    id: 2,
    nombre: 'Recepcionista',
    apellido: 'Principal',
    email: 'recepcion@clinica.com',
    password: '123456',
    rol: 'recepcionista'
  },
  {
    id: 3,
    nombre: 'Dr. Roberto',
    apellido: 'Mendoza',
    email: 'dr.mendoza@clinica.com',
    password: 'doctor123',
    rol: 'doctor'
  }
];

// Para mantener compatibilidad con el código existente
export const mockClients = mockPacientes;
export const mockItems = mockDoctores;
export const mockOrders = mockCitas;
