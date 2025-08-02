import FCMNotification from '@/components/shared/toast/FCMNotification';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface NotificationData {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    action?: string;
    [key: string]: any;
  };
}

interface ActiveNotification extends NotificationData {
  id: string;
  timestamp: number;
}

interface UseFCMNotificationsOptions {
  maxNotifications?: number;
  defaultDuration?: number;
  onNotificationAction?: (action: string, notification: NotificationData) => void;
}

export const useFCMNotifications = (options: UseFCMNotificationsOptions = {}) => {
  const {
    maxNotifications = 5,
    defaultDuration = 4000,
    onNotificationAction,
  } = options;

  const [notifications, setNotifications] = useState<ActiveNotification[]>([]);

  const addNotification = (notification: NotificationData) => {
    const newNotification: ActiveNotification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, maxNotifications);
      return updated;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationAction = (action: string, notification: NotificationData) => {
    if (onNotificationAction) {
      onNotificationAction(action, notification);
    }
  };

  useEffect(() => {
    function handleFcmMessage(e: Event): void {
      const customEvent = e as CustomEvent;
      const message = customEvent.detail;
      addNotification(message);
    }

    window.addEventListener("fcm-foreground-message", handleFcmMessage);
    return () => {
      window.removeEventListener("fcm-foreground-message", handleFcmMessage);
    };
  }, []);

  // Componente de contenedor de notificaciones
  const NotificationContainer = () => {
    if (notifications.length === 0) return null;

    return createPortal(
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none max-w-sm">
        {notifications.map((notification, index) => (
          <div key={notification.id} className="pointer-events-auto">
            <FCMNotification
              key={index}
              message={notification}
              onDismiss={() => removeNotification(notification.id)}
              onAction={(action: string) => {
                handleNotificationAction(action, notification);
                removeNotification(notification.id);
              }}
              duration={defaultDuration}
            />
          </div>
        ))}
      </div>,
      document.body
    );
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    NotificationContainer,
  };
};