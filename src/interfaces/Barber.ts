import { Hour } from "./Hour"

export interface Barber {
  id?: string
  nombre: string
  descripcion: string
  latitud: number
  longitud: number
  direccion: string
  cantidadDeMinutosPorTurno: number
  ciudad_id: string
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
  ciudad_id: string
  ciudad: string
  puntaje: number
  cantResenas: number
  imagenes: string[]
  imagen_perfil: string
  horarios: Hour[]
}

