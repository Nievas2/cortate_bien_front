import { Barber } from "./Barber"
import { Client } from "./User"

export interface CreateAppointment {
  fecha: Date
  hora: string
  nota: string
}
export interface Appointment {
  id: string
  barberia: Barber
  cliente: Client
  fecha: string
  hora: string
  notas: string
  estado: string
}
