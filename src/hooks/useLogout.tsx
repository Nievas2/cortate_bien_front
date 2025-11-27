import { useAuthContext } from "@/contexts/authContext";
import { deleteTokenFirebase } from "@/services/FirebaseService";
import axiosInstance from "@/api/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Cookies from "js-cookie";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();
  const { mutate: deleteToken } = useMutation({
    mutationKey: ["delete-token-firebase"],
    mutationFn: async (token: string) => {
      return deleteTokenFirebase(token);
    },
  });

  const logOut = async () => {
    try {
      setLoading(true);

      if (authUser?.user?.id) {
        try {
          await axiosInstance.delete(
            `/auth/logout/devices/${authUser.user.id}`
          );
        } catch (error) {
          console.error("Error calling backend logout:", error);
        }
      }

      localStorage.removeItem("active");
      if (authUser?.fcmToken) {
        deleteToken(authUser?.fcmToken);
      }
      Cookies.remove("token");
      setAuthUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logOut };
};
