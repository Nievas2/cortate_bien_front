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
  barber.horarioPorDia.forEach((element: any) => {
    console.log(element.pausa_inicio.length)

    if (element.pausa_inicio.length === 0) element.pausa_inicio = null
    if (element.pausa_fin.length === 0) element.pausa_fin = null
  })
  console.log(barber)

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
      horarioPorDia: barber.horarioPorDia,
    })
    return res
  } catch (error) {
    throw error
  }
}

export async function updateBarber(barber: Barber, id: string) {
  barber.horarioPorDia.forEach((element: any) => {
    console.log(element.pausa_inicio.length)

    if (element.pausa_inicio.length === 0) element.pausa_inicio = null
    if (element.pausa_fin.length === 0) element.pausa_fin = null
  })
  console.log(barber)

  try {
    const res = axiosInstance.post(`barberia/update/${id}`, {
      nombre: barber.nombre,
      descripcion: barber.descripcion,
      latitud: barber.latitud,
      longitud: barber.longitud,
      direccion: barber.direccion,
      cantidadDeMinutosPorTurno: barber.cantidadDeMinutosPorTurno,
      ciudad_id: barber.ciudad_id,
      imagenes: barber.imagenes,
      imagen_perfil: barber.imagen_perfil,
      horarioPorDia: barber.horarioPorDia,
    })
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
