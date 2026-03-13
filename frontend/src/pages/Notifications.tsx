import { Download, Bell, Mail, FileText } from 'lucide-react';
import { mockNotifications } from '@/data/mockData';

export default function Notifications() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="gov-card overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <div className="divide-y divide-border">
          {mockNotifications.map((notification) => (
            <div key={notification.id} className={`px-4 md:px-6 py-4 flex items-start gap-4 hover:bg-muted/30 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${!notification.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {notification.category === 'Status Update' && <FileText size={16} />}
                {notification.category === 'Action Required' && <Bell size={16} />}
                {notification.category === 'Reminder' && <Bell size={16} />}
                {notification.category === 'Circular' && <Mail size={16} />}
                {notification.category === 'System' && <Bell size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notification.read ? 'font-medium text-foreground' : 'text-foreground/80'}`}>{notification.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-muted-foreground tabular-data">{notification.date}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{notification.category}</span>
                </div>
              </div>
              {notification.downloadUrl && (
                <button className="text-primary hover:text-primary/80 transition-colors shrink-0">
                  <Download size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
