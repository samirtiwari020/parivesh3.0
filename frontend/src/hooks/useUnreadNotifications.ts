import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

interface NotificationItem {
  _id: string;
  isRead: boolean;
}

interface NotificationsResponse {
  success: boolean;
  notifications: NotificationItem[];
}

export function useUnreadNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await apiRequest<NotificationsResponse>('/api/notifications', {
        method: 'GET',
        token,
      });

      setUnreadCount((response.notifications || []).filter((notification) => !notification.isRead).length);
    } catch {
    }
  }, []);

  useEffect(() => {
    void fetchUnreadCount();

    const interval = window.setInterval(() => {
      void fetchUnreadCount();
    }, 30000);

    return () => {
      window.clearInterval(interval);
    };
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    refetchUnreadCount: fetchUnreadCount,
  };
}
