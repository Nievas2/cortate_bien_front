import { decodeJwt } from "@/utils/decodeJwt";
import Cookies from "js-cookie";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  sub: string;
  name: string;
  username: string;
  email: string;
  rol: string;
  tipo_de_cuenta: "CLIENTE" | "BARBERO";
  city_id: number;
  city: string;
  tokenRefresh: string;
  state: string;
  country: string;
}

export interface AuthUser {
  user: User;
  token: string;
  fcmToken?: string;
}

interface AuthContextType {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = Cookies.get("token");

  let storedUser: AuthUser | null = null;
  if (token) {
    try {
      const user = decodeJwt(token); // Asegúrate de que esto devuelva una cadena JSON válida
      storedUser = {
        token,
        user,
      };
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const [authUser, setAuthUser] = useState<AuthUser | null>(
    storedUser ? storedUser : null
  );

  useEffect(() => {
    const handleTokenRefresh = (event: CustomEvent) => {
      const newToken = event.detail;
      if (newToken) {
        try {
          const user = decodeJwt(newToken);
          setAuthUser({
            token: newToken,
            user,
          });
        } catch (error) {
          console.error("Error decoding refreshed token:", error);
        }
      }
    };

    window.addEventListener(
      "auth:refresh",
      handleTokenRefresh as EventListener
    );

    return () => {
      window.removeEventListener(
        "auth:refresh",
        handleTokenRefresh as EventListener
      );
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
