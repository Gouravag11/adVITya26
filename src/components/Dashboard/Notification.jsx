/* eslint-disable react-refresh/only-export-components */
import { useState, useCallback, useEffect } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-react';

/* ================================
   Hook (exported)
================================ */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(
    ({ type = 'info', message }) => {
      setNotifications((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type,
          message,
          leaving: false,
        },
      ]);
    },
    []
  );

  const dismissNotification = useCallback((id) => {
    // Mark as leaving
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, leaving: true } : n
      )
    );

    // Remove after animation
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    }, 300);
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
};

/* ================================
   Item Component
================================ */
export const NotificationItem = ({ notification, onDismiss }) => {
  useEffect(() => {
    if (notification.leaving) return;

    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification.id, notification.leaving, onDismiss]);

  const icons = {
    success: <CheckCircle className="text-green-400" />,
    info: <Info className="text-blue-400" />,
    warning: <AlertTriangle className="text-yellow-400" />,
    error: <XCircle className="text-red-400" />,
  };

  return (
    <div
      className={`
        bg-zinc-800 text-white rounded-lg p-4 flex gap-3 border-l-4
        transition-all duration-300 ease-out
        will-change-transform
        ${
          notification.leaving
            ? 'opacity-0 translate-x-full scale-95'
            : 'opacity-100 translate-x-0 scale-100'
        }
      `}
    >
      {icons[notification.type]}

      <p className="flex-1 text-sm">{notification.message}</p>

      <button
        onClick={() => onDismiss(notification.id)}
        disabled={notification.leaving}
        className="opacity-70 hover:opacity-100 transition"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
