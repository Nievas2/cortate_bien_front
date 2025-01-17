import { Hour } from "./Hour"

export interface Barber {
  nombre: string
  descripcion: string
  latitud: number
  longitud: number
  direccion: string
  cantidadDeMinutosPorTurno: number
  ciudad_id: string
  imagenes: string[]
  imagen_perfil: string
  horarios: Hour[] | null
}
