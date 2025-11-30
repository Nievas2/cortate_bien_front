export interface MessageResponseDto {
  id: string
  contenido: string
  chatId: string
  fechaEnvio?: Date
  leido: boolean
  remitente: {
    id: string
    nombre: string
    apellido: string
    email?: string
    imagen?: string | null
  }
  createdAt: string
  updatedAt: string
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
  ultimaActividad?: Date
  updatedAt: string
  ultimoMensaje?: MessageResponseDto
  mensajesNoLeidos?: number
  visto: boolean
}
