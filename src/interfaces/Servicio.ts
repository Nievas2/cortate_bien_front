export interface Servicio {
  nombre: string
  precio: number
}

export interface ServicioWithId extends Servicio {
  id: string
}