import { useAuthContext } from "@/contexts/authContext";
import { decodeJwt } from "@/utils/decodeJwt";
import { setCookieAsync } from "./useLogin";

export const useUpdateSession = () => {
  const { setAuthUser } = useAuthContext();

  const updateSession = async (accessToken: string) => {
    try {
      const user = decodeJwt(accessToken);
      const userAuth = {
        user: user,
        token: accessToken,
      };
      setAuthUser(userAuth);

      await setCookieAsync("token", accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      });

      return true;
    } catch (error) {
      console.error("Error updating session:", error);
      return false;
    }
  };

  return { updateSession };
};
