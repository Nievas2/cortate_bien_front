import axiosInstance from "@/api/axiosInstance"
import { Barber, BarberBasic, BarberGet, BarberProfile } from "@/interfaces/Barber"
import { Servicio } from "@/interfaces/Servicio"

export async function getBarberById(id: string) {
  try {
    const res = await axiosInstance.get(`barberia/find/${id}`)
    const barber: BarberGet = res.data
    return barber
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

export async function createService(service: Servicio, id: string) {
  try {
    const res = await axiosInstance.post("servicio/create/" + id, service)
    return res
  } catch (error) {
    throw error
  }
}

export async function updateService(service: Servicio, id: string) {
  try {
    const res = await axiosInstance.put("servicio/update/" + id, service)
    return res
  } catch (error) {
    throw error
  }
}

export async function deleteService(id: string) {
  try {
    const res = await axiosInstance.delete("servicio/delete/" + id)
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
  barberUpdated.latitud = Number(barberUpdated.latitud)
  barberUpdated.longitud = Number(barberUpdated.longitud)
  barberUpdated.cantidadDeMinutosPorTurno = Number(
    barberUpdated.cantidadDeMinutosPorTurno
  )
  barberUpdated.ciudad_id = Number(barberUpdated.ciudad_id)
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

function getUpdatedProfileFields(
  original: BarberProfile,
  updated: BarberProfile
): Partial<BarberProfile> {
  const updatedFields: Partial<BarberProfile> = {}

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
        updatedFields[key as keyof BarberProfile] = updatedValue
      }
    }
  }

  return updatedFields
}

function getUpdatedBasicFields(
  original: BarberBasic,
  updated: BarberBasic
): Partial<BarberBasic> {
  const updatedFields: Partial<BarberBasic> = {}

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
        updatedFields[key as keyof BarberBasic] = updatedValue
      }
    }
  }

  return updatedFields
}

export async function updateBarberProfile(
  barber: BarberProfile,
  id: string,
  barberUpdated: BarberProfile
) {
  const updatedFields = getUpdatedProfileFields(barber, barberUpdated)

  // If the updatedFields object contains an "imagenes" key, extract its value directly
  if (updatedFields.imagenes) {
    updatedFields.imagenes = updatedFields.imagenes as string[]
  }

  try {
    const res = axiosInstance.put(
      `barberia/update/profile/${id}`,
      updatedFields
    )
    return res
  } catch (error) {
    throw error
  }
}

export async function updateBarberBasic(
  barber: BarberBasic,
  id: string,
  barberUpdated: BarberBasic
) {
  barberUpdated.latitud = Number(barberUpdated.latitud)
  barberUpdated.longitud = Number(barberUpdated.longitud)
  barberUpdated.cantidadDeMinutosPorTurno = Number(
    barberUpdated.cantidadDeMinutosPorTurno
  )
  barberUpdated.ciudad_id = Number(barberUpdated.ciudad_id)
  // Normalizar los campos del objeto actualizado
  barberUpdated.horarios.forEach((element) => {
    if (element.pausa_inicio != null && element.pausa_inicio.length === 0)
      element.pausa_inicio = null
    if (element.pausa_fin != null && element.pausa_fin.length === 0)
      element.pausa_fin = null
  })

  const updatedFields = getUpdatedBasicFields(barber, barberUpdated)

  try {
    const res = axiosInstance.put(`barberia/update/basic/${id}`, updatedFields)
    return res
  } catch (error) {
    throw error
  }
}

/* Gets */
export async function getBarbers({
  page,
  order,
  city,
  long,
  lat,
  radius,
}: {
  page?: number
  order?: string
  city?: number
  long?: number
  lat?: number
  radius?: number
}) {
  try {
    const res = await axiosInstance.get(
      `barberia/find/all?page=${page}&order=${order}&city=${city}&long=${long}&lat=${lat}&radius=${radius}`
    )
    return res
  } catch (error) {
    throw error
  }
}

export async function getBarbersById(id: string) {
  try {
    const res = await axiosInstance.get(`barberia/find/all/barbero/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function getBarbersDisabled(filter: string) {
  try {
    const res = await axiosInstance.get(
      `barberia/find/all/admin?status=${filter}`
    )
    return res
  } catch (error) {
    throw error
  }
}

export async function getServicesByBarberId(id: string) {
  try {
    const res = await axiosInstance.get(`servicio/find/all/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function activeBarbery(id: string) {
  try {
    const res = await axiosInstance.patch(`barberia/active`, {
      id: id,
      estado: "ACTIVO",
    })
    return res
  } catch (error) {
    throw error
  }
}

export async function deleteBarbery(id: string) {
  try {
    const res = await axiosInstance.delete(`barberia/delete/${id}`)
    return res
  } catch (error) {
    throw error
  }
}
