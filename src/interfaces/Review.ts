export interface CreateReview {
  calificacion: string
  descripcion: string
}

export interface Review {
  id: string
  descripcion: string
  calificacion: number
  barberia: string
  barberiaId: string
}

export interface ReviewBarber {
  id: string
  barberiaId: string
  barberia: string
  descripcion: string
  calificacion: number
  user: string
}
