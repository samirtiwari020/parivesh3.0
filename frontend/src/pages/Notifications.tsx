import { useEffect, useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

const AUTH_TOKEN_KEY = 'parivesh_auth_token';

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  batchId?: string | null;
  recipient?: {
    name?: string;
    email?: string;
    role?: string;
    state?: string;
  };
}

interface NotificationsResponse {
  success: boolean;
  notifications: NotificationItem[];
}

export default function Notifications() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [targetState, setTargetState] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['APPLICANT', 'STATE_REVIEWER', 'CENTRAL_REVIEWER', 'COMMITTEE_REVIEWER']);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const fetchNotifications = async () => {
    setIsLoading(true);
    setLoadError('');

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setNotifications([]);
      setLoadError('Please login again.');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isAdmin ? '/api/notifications/admin/all' : '/api/notifications';
      const response = await apiRequest<NotificationsResponse>(endpoint, {
        method: 'GET',
        token,
      });
      setNotifications(response.notifications || []);
    } catch (error) {
      setNotifications([]);
      setLoadError(error instanceof Error ? error.message : 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchNotifications();
  }, [isAdmin]);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      await apiRequest(`/api/notifications/read/${id}`, {
        method: 'PUT',
        token,
      });
      await fetchNotifications();
    } catch {
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      await apiRequest('/api/notifications/read-all', {
        method: 'PUT',
        token,
      });
      await fetchNotifications();
    } catch {
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((previous) => previous.includes(role)
      ? previous.filter((item) => item !== role)
      : [...previous, role]);
  };

  const createAdminNotification = async (event: React.FormEvent) => {
    event.preventDefault();

    setFormError('');
    setFormSuccess('');

    if (!formTitle.trim() || !formMessage.trim()) {
      setFormError('Title and message are required.');
      return;
    }

    if (selectedRoles.length === 0) {
      setFormError('Select at least one target role.');
      return;
    }

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setFormError('Please login again.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/api/notifications/admin', {
        method: 'POST',
        token,
        body: JSON.stringify({
          title: formTitle.trim(),
          message: formMessage.trim(),
          targetRoles: selectedRoles,
          targetState: targetState.trim() || undefined,
        }),
      });

      setFormTitle('');
      setFormMessage('');
      setTargetState('');
      setFormSuccess('Notification created successfully.');
      await fetchNotifications();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to create notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const editAdminNotification = async (notification: NotificationItem) => {
    const nextTitle = window.prompt('Edit title', notification.title);
    if (!nextTitle || !nextTitle.trim()) return;

    const nextMessage = window.prompt('Edit message', notification.message);
    if (!nextMessage || !nextMessage.trim()) return;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      await apiRequest(`/api/notifications/admin/${notification._id}`, {
        method: 'PUT',
        token,
        body: JSON.stringify({
          title: nextTitle.trim(),
          message: nextMessage.trim(),
        }),
      });
      await fetchNotifications();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to update notification');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-serif font-bold">Notifications</h2>
        {!isAdmin && (
          <button
            onClick={markAllAsRead}
            className="px-3 py-2 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isAdmin && (
        <div className="gov-card p-6 space-y-4">
          <h3 className="font-semibold text-lg">Create Notification</h3>
          <form onSubmit={createAdminNotification} className="space-y-4">
            <div>
              <label className="gov-label">Title</label>
              <input value={formTitle} onChange={(event) => setFormTitle(event.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="gov-label">Message</label>
              <textarea value={formMessage} onChange={(event) => setFormMessage(event.target.value)} rows={4} className="gov-input" />
            </div>
            <div>
              <label className="gov-label">Target State (optional, only for state reviewers)</label>
              <input value={targetState} onChange={(event) => setTargetState(event.target.value)} className="gov-input" placeholder="e.g. Maharashtra" />
            </div>
            <div>
              <label className="gov-label">Target Roles</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {['APPLICANT', 'STATE_REVIEWER', 'CENTRAL_REVIEWER', 'COMMITTEE_REVIEWER'].map((role) => (
                  <label key={role} className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>
            {formError && <p className="text-xs text-destructive">{formError}</p>}
            {formSuccess && <p className="text-xs text-accent">{formSuccess}</p>}
            <button type="submit" disabled={isSubmitting} className="gov-btn-primary disabled:opacity-50">
              {isSubmitting ? 'Publishing...' : 'Publish Notification'}
            </button>
          </form>
        </div>
      )}

      <div className="gov-card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2"><Bell size={16} /> {isAdmin ? 'All Notifications' : 'My Notifications'}</h3>
          <span className="text-xs text-muted-foreground">Unread: {unreadCount}</span>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="px-6 py-10 text-center text-muted-foreground">Loading notifications...</div>
          ) : loadError ? (
            <div className="px-6 py-10 text-center text-destructive">{loadError}</div>
          ) : notifications.length === 0 ? (
            <div className="px-6 py-10 text-center text-muted-foreground">No notifications found.</div>
          ) : notifications.map((notification) => (
            <div key={notification._id} className={`px-6 py-4 ${notification.isRead ? 'bg-background' : 'bg-primary/5'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.createdAt).toLocaleString('en-GB')}
                    {isAdmin && notification.recipient ? ` • ${notification.recipient.name || notification.recipient.email} (${notification.recipient.role || '-'})` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!isAdmin && !notification.isRead && (
                    <button onClick={() => markAsRead(notification._id)} className="px-2 py-1 text-xs rounded bg-primary/10 text-primary hover:bg-primary/20">Mark Read</button>
                  )}
                  {isAdmin && (
                    <button onClick={() => editAdminNotification(notification)} className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-700 hover:bg-amber-200">Edit</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
