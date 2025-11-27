import { useMutation } from "@tanstack/react-query";
import { login as loginService } from "@/services/AuthService";
import { useAuthContext } from "@/contexts/authContext";
import { decodeJwt } from "@/utils/decodeJwt";
import Cookies from "js-cookie";

export interface LoginParams {
  email: string;
  password: string;
}

export const setCookieAsync = (
  name: string,
  value: string,
  options: Cookies.CookieAttributes
): Promise<void> => {
  return new Promise((resolve) => {
    Cookies.set(name, value, options);
    resolve();
  });
};

const useLogin = () => {
  const { setAuthUser } = useAuthContext();

  const { mutateAsync: login, isPending: loading } = useMutation({
    mutationFn: async ({ email, password }: LoginParams) => loginService({ email, password }),
    onSuccess: async (data) => {
      const user = decodeJwt(data.data.access_token);
      const userAuth = {
        user: user,
        token: data.data.access_token,
      };
      setAuthUser(userAuth);

      await setCookieAsync("token", data.data.access_token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      });

      if (userAuth.user.tipo_de_cuenta == "BARBERO") {
        window.location.href = "/dashboard";
      }
      if (userAuth.user.tipo_de_cuenta == "CLIENTE") {
        window.location.href = "/barbers";
      }
    },
    onError: (error: any) => {
      if (error.response && error.response.status === 401) {
        throw new Error("Credenciales incorrectas.");
      }
    },
  });

  return { loading, login };
};

export default useLogin;
