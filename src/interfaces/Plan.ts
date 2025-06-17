export interface Plan {
  id: string
  nombre: string
  precio: number
  descripcion: string
  turnosMaximos: number
  cantDias: number
}

export interface PlanGet {
  id: string
  nombre: string
  precio: number
  descripcion: string
  turnosMaximos: number
  cantDias: number
  precioPromedio: boolean
  servicios: boolean
  barberos: boolean
  autoActivacion: boolean
  soportePrioritario: boolean
}
