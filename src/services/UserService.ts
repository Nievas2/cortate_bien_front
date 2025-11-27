import axiosInstance from "@/api/axiosInstance";

export async function getUserById(id: string) {
  try {
    const res = await axiosInstance.get(`users/find/${id}`);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function completeRegistration({
  fechaNacimiento,
  telefono,
  tipoDeCuenta,
  ciudad_id,
}: {
  fechaNacimiento: string | number;
  telefono: string;
  tipoDeCuenta: string;
  ciudad_id: number;
}) {
  try {
    const res = await axiosInstance.patch(`users/complete-registration`, {
      fechaNacimiento: fechaNacimiento,
      telefono: telefono,
      tipoDeCuenta: tipoDeCuenta,
      ciudad: ciudad_id,
    });
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updateLocation(data: {
  ciudad: number;
  password: string;
}) {
  try {
    const res = await axiosInstance.patch(`users/update/location`, data);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function changeAccountType(data: { password: string }) {
  try {
    const res = await axiosInstance.patch(`users/update/type`, data);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function updatePassword(data: {
  oldPassword: string;
  newPassword: string;
}) {
  try {
    const res = await axiosInstance.patch(`users/update/password`, data);
    return res;
  } catch (error) {
    throw error;
  }
}
