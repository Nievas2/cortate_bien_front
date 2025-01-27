import { useAuthContext } from "@/contexts/authContext";
import { useState } from "react";
import { useCookies } from "react-cookie";

export const useLogout = () => {
  const [, removeCookie] = useCookies(['token']);
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const logOut = () => {
    try {
      setLoading(true);
      removeCookie('token', "");
      setAuthUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logOut };
};