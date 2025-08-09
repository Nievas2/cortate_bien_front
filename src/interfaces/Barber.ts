import { Hour } from "./Hour"
import { ServicioWithId } from "./Servicio"

export interface Barber {
  id?: string
  nombre: string
  descripcion: string
  latitud: number
  longitud: number
  direccion: string
  cantidadDeMinutosPorTurno: number
  ciudad_id: number
  imagenes: string[]
  imagen_perfil: string
  horarios: Hour[]
}

export interface BarberGet {
  id?: string
  nombre: string
  descripcion: string
  latitud: number
  longitud: number
  direccion: string
  cantidadDeMinutosPorTurno: number
  ciudad_id: number
  ciudad: string
  puntaje: number
  cantResenas: number
  imagenes: string[]
  imagen_perfil: string
  horarios: Hour[]
  barbero: string
  servicios?: ServicioWithId[];
  precioPromedio?: number;
  idPropietario?: string;
}

export interface BarberProfile {
  nombre: string
  descripcion: string
  imagenes: string[]
  imagen_perfil: string
}

export interface BarberBasic {
  latitud: number
  longitud: number
  direccion: string
  cantidadDeMinutosPorTurno: number
  ciudad_id: number
  horarios: Hour[]
}
