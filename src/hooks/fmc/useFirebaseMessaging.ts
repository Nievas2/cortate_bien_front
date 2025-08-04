import { useEffect, useRef } from "react";
import { getMessagingIfSupported } from "../../firebase";
import { getToken, onMessage, Messaging } from "firebase/messaging";
import { AuthUser } from "@/contexts/authContext";

type UseFirebaseMessagingOptions = {
  authUser: AuthUser | null;
  setAuthUser: (val: AuthUser | null) => void;
  mutate: (token: string) => void;
};

export function useFirebaseMessaging({
  authUser,
  setAuthUser,
  mutate,
}: UseFirebaseMessagingOptions) {
  const unsubscribeRef = useRef<() => void>();

  useEffect(() => {
    let active = true;

    (async () => {
      // Solo intentá activar mensajes si hay usuario autenticado
      if (!authUser) return;

      const messaging: Messaging | null = await getMessagingIfSupported();
      if (!messaging || !active) return;

      const activarMensajes = async () => {
        const alreadyActive = localStorage.getItem("active");
        try {
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_VAPID_KEY,
          });
          if (token && authUser.user) {
            setAuthUser({ ...authUser, fcmToken: token });
            if (alreadyActive !== "true") {
              mutate(token);
              localStorage.setItem("active", "true");
            }
          }
        } catch (err) {
          // Puede ser porque el usuario no permitió notificaciones, o incompatibilidad
          console.warn("No se pudo obtener token FCM:", err);
        }
      };

      if (!authUser.fcmToken) {
        await activarMensajes();
      }

      // Escuchador de mensajes foreground
      unsubscribeRef.current = onMessage(messaging, (message) => {
        // Se puede levantar un evento personalizado o usar una callback externa
        // El toast va en App para mantener la UI separada del hook
        window.dispatchEvent(
          new CustomEvent("fcm-foreground-message", { detail: message })
        );
      });
    })();

    return () => {
      active = false;
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
    // eslint-disable-next-line
  }, [authUser]);
}
