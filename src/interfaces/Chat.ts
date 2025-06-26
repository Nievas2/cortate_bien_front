export interface MessageResponseDto {
  id: string
  contenido: string
  fechaEnvio: Date
  leido: boolean
  remitente: {
    id: string
    nombre: string
    apellido: string
  }
}

export interface ChatResponseDto {
  id: string
  cliente: {
    id: string
    nombre: string
    apellido: string
  }
  barbero: {
    id: string
    nombre: string
    apellido: string
  }
  barberia: {
    id: string
    nombre: string
  }
  ultimaActividad: Date
  ultimoMensaje?: {
    contenido: string
    fechaEnvio: Date
    remitente: string
    visto: boolean
  }
  visto: boolean
}
