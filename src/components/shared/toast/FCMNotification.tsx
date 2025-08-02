import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Eye } from 'lucide-react';

interface NotificationData {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: {
    action?: string;
    [key: string]: any;
  };
}

interface FCMNotificationProps {
  message: NotificationData;
  onDismiss: () => void;
  onAction?: (action: string) => void;
  duration?: number;
}

const FCMNotification: React.FC<FCMNotificationProps> = ({
  message,
  onDismiss,
  onAction,
  duration = 4000,
}) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          setIsVisible(false);
          setTimeout(onDismiss, 300);
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [duration, onDismiss]);

  const handleAction = () => {
    if (message.data?.action && onAction) {
      onAction(message.data.action);
    }
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };

  const containerVariants = {
    initial: {
      x: 400,
      scale: 0.7,
      opacity: 0,
    },
    animate: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      },
    },
    exit: {
      x: 400,
      scale: 0.7,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        duration: 0.3,
      },
    },
  };

  const progressVariants = {
    initial: { width: "100%" },
    animate: { 
      width: `${progress}%`,
      transition: { duration: 0.1, ease: "linear" }
    },
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative flex flex-col gap-3 p-4 rounded-xl shadow-xl border border-gray-700 
                   max-w-sm min-w-[320px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                   text-white overflow-hidden backdrop-blur-sm"
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
      >
        {/* Header con icono y título */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.div 
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 
                         flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 15 }}
              transition={{ duration: 0.2 }}
            >
              <Bell className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate leading-tight">
                {message.notification?.title || 'Notificación'}
              </h4>
            </div>
          </div>
          
          {/* Botón cerrar */}
          <motion.button
            onClick={handleDismiss}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/70 
                       flex items-center justify-center transition-colors duration-200 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4 text-gray-300 hover:text-white" />
          </motion.button>
        </div>

        {/* Contenido del mensaje */}
        {message.notification?.body && (
          <motion.div 
            className="pl-13"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <p className="text-sm text-gray-300 leading-relaxed">
              {message.notification.body}
            </p>
          </motion.div>
        )}

        {/* Botones de acción */}
        <motion.div 
          className="flex gap-2 mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.button
            onClick={handleDismiss}
            className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 
                       hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium
                       transition-all duration-200 shadow-md focus:outline-none focus:ring-2 
                       focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cerrar
          </motion.button>
          
          {/* Botón secundario opcional */}
          {message.data?.action && (
            <motion.button
              onClick={handleAction}
              className="px-4 py-2.5 rounded-lg border border-gray-600 hover:border-gray-500 
                         text-gray-300 hover:text-white text-sm font-medium
                         transition-all duration-200 hover:bg-gray-700/50 focus:outline-none 
                         focus:ring-2 focus:ring-gray-400/50 focus:ring-offset-2 focus:ring-offset-gray-900
                         flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Eye className="w-4 h-4" />
              Ver
            </motion.button>
          )}
        </motion.div>

        {/* Barra de progreso */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/30 rounded-b-xl overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-b-xl"
            variants={progressVariants}
            initial="initial"
            animate="animate"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FCMNotification;