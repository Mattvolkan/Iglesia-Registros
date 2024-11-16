export interface User {
  username: string;
  password: string;
  role: 'servidor' | 'pastor';
}

export type ServiceType = 
  | 'Escuela Dominical'
  | 'Servicio de Adoracion y Sanidad'
  | 'Culto Juvenil'
  | 'Otro';

export interface AttendanceRecord {
  date: string;
  damas: number;
  caballeros: number;
  ninos: number;
  jovenes: number;
  ancianos: number;
  visitantes: number;
  registradoPor: string;
  tipoServicio: ServiceType;
  otroServicio?: string;
}

export interface Visitante {
  id: string;
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  email?: string;
  fechaRegistro: string;
  registradoPor: string;
  tipoServicio: ServiceType;
  otroServicio?: string;
}