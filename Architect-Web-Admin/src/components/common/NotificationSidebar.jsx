import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { apiRequest } from '../../lib/apiClient';

export default function NotificationSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      apiRequest('/notifications')
        .then(res => setNotifications(res.notifications || []))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleNotificationClick = (notif) => {
    if (notif.data && notif.data.email) {
      window.open(`mailto:${notif.data.email}`);
    }
    // Mark as read in backend
    apiRequest(`/notifications/${notif._id}/read`, { method: 'PATCH' });
    // Remove from list immediately
    setNotifications(prev => prev.filter(n => n._id !== notif._id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-(--surface-elevated) text-(--brand-camel-dark) hover:bg-(--brand-camel-dark) hover:text-white transition-colors border border-(--border-subtle)"
        onClick={() => setOpen((prev) => !prev)}
        title="Activity & system notices"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 min-w-4.5 h-4 px-1 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-80 rounded-xl border border-(--brand-camel-dark) bg-(--surface-card) shadow-2xl">
          <div className="flex items-center justify-between border-b border-(--brand-camel-dark) px-3 py-2">
            <span className="text-xs font-semibold text-(--text-primary)">
              Notifications
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[10px] text-(--text-muted) hover:text-(--text-primary)"
            >
              Close
            </button>
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto px-3 py-2 text-xs text-(--text-muted)">
            {loading ? (
              <div className="rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-2">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-2">No new notifications yet.</div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif._id}
                  className={`rounded-lg border border-(--border-subtle) bg-(--surface-elevated) px-3 py-2 cursor-pointer transition-colors ${notif.read ? 'opacity-60' : 'hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                  onClick={() => handleNotificationClick(notif)}
                  title={notif.message}
                >
                  <div className="font-semibold text-(--brand-camel-dark)">{notif.message}</div>
                  {notif.data && notif.data.email && (
                    <div className="text-[10px] text-blue-600 underline">{notif.data.email}</div>
                  )}
                  <div className="text-[10px] text-(--text-muted)">{new Date(notif.createdAt).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-(--border-subtle) p-2 text-center">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate('/contact');
              }}
              className="w-full rounded-lg bg-(--surface-elevated) py-1.5 text-xs font-medium text-(--brand-camel-dark) hover:bg-(--brand-camel) hover:text-white transition-colors"
            >
              View All Contact Inquiries →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

