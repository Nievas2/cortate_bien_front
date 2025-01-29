import axiosInstance from "@/api/axiosInstance"
import { Barber } from "@/interfaces/Barber"

export async function getBarberById(id: string) {
  try {
    const res = await axiosInstance.get(`barberia/find/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function createbarber(barber: any) {
  barber.horarios.forEach((element: any) => {
    if (element.pausa_inicio.length === 0) element.pausa_inicio = null
    if (element.pausa_fin.length === 0) element.pausa_fin = null
  })
  try {
    const res = axiosInstance.post("barberia/create", {
      nombre: barber.nombre,
      descripcion: barber.descripcion,
      latitud: barber.latitud,
      longitud: barber.longitud,
      direccion: barber.direccion,
      cantidadDeMinutosPorTurno: barber.cantidadDeMinutosPorTurno,
      ciudad_id: barber.ciudad_id,
      imagenes: barber.imagenes,
      imagen_perfil: barber.imagen_perfil,
      horarios: barber.horarios,
    })
    return res
  } catch (error) {
    throw error
  }
}

export async function updateBarber(
  barber: Barber,
  id: string,
  barberUpdated: Barber
) {
  // Normalizar los campos del objeto actualizado
  barberUpdated.horarios.forEach((element) => {
    if (element.pausa_inicio != null && element.pausa_inicio.length === 0)
      element.pausa_inicio = null
    if (element.pausa_fin != null && element.pausa_fin.length === 0)
      element.pausa_fin = null
  })

  // Comparar barber y barberUpdated para generar un JSON con solo los cambios
  const updatedFields: Partial<Barber> = getUpdatedFields(barber, barberUpdated)

  try {
    // Enviar solo los campos modificados a la API
    const res = await axiosInstance.put(`barberia/update/${id}`, updatedFields)
    return res
  } catch (error) {
    throw error
  }
}

// Función para comparar dos objetos y devolver los campos actualizados
function getUpdatedFields(original: Barber, updated: Barber): Partial<Barber> {
  const updatedFields: Partial<Barber> = {}

  for (const key in updated) {
    if (Object.prototype.hasOwnProperty.call(updated, key)) {
      const originalValue = (original as any)[key]
      const updatedValue = (updated as any)[key]

      // Comparar valores (considera arrays, objetos, y valores simples)
      if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
        if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
          ;(updatedFields as any)[key] = updatedValue
        }
      } else if (originalValue !== updatedValue) {
        updatedFields[key as keyof Barber] = updatedValue
      }
    }
  }

  return updatedFields
}

/* Gets */
export async function getBarbers({
  page,
  order,
  city,
}: {
  page?: number
  order?: string
  city?: number
}) {
  try {
    const res = await axiosInstance.get(`barberia/find/all/${page}/${order}/${city}`, )
    return res
  } catch (error) {
    throw error
  }
}
export async function getBarbersById(id: string) {
  console.log(id)

  try {
    const res = await axiosInstance.get(`barberia/find/all/barbero/${id}`)
    console.log(res)

    return res
  } catch (error) {
    throw error
  }
}

export async function getBarbersDisabled() {
  try {
    const res = await axiosInstance.get("barberia/find/all/disabled")
    return res
  } catch (error) {
    throw error
  }
}

export async function activeBarbery(id: string) {
  try {
    const res = await axiosInstance.patch(`barberia/active/${id}`)
    return res
  } catch (error) {
    throw error
  }
}
