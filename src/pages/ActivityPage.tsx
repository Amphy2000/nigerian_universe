import { Gavel, Flame, BarChart3, MessageCircle, Scale, Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { NOTIFICATIONS } from '@/data/mockData';
import type { Notification } from '@/types';

const ICON_MAP = {
  gavel: Gavel,
  fire: Flame,
  chart: BarChart3,
  message: MessageCircle,
  verdict: Scale,
};

export function ActivityPage() {
  const { showToast } = useApp();

  return (
    <div className="pb-28 md:pb-12 max-w-2xl mx-auto">
      <div className="mb-6 pt-4">
        <h1 className="font-display text-2xl font-extrabold flex items-center gap-2">
          <Bell className="w-6 h-6 text-gold-400" /> Activity
        </h1>
        <p className="text-sm text-ink-400 mt-1">Updates from the court</p>
      </div>

      <div className="space-y-2.5">
        {NOTIFICATIONS.map((n) => (
          <NotificationItem key={n.id} notification={n} onClick={() => showToast('Opening matter...', 'info')} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-ink-500">You're all caught up.</p>
      </div>
    </div>
  );
}

function NotificationItem({ notification, onClick }: { notification: Notification; onClick: () => void }) {
  const Icon = ICON_MAP[notification.icon];
  return (
    <button
      onClick={onClick}
      className={`w-full card p-4 flex items-start gap-3 text-left hover:border-white/15 transition-all ${!notification.read ? 'border-gold-500/20 bg-gold-500/5' : ''}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        notification.icon === 'verdict' || notification.icon === 'gavel'
          ? 'bg-gold-500/15 border border-gold-500/20'
          : notification.icon === 'fire'
          ? 'bg-crimson-500/15 border border-crimson-500/20'
          : 'bg-forest-500/15 border border-forest-500/20'
      }`}>
        <Icon className={`w-4.5 h-4.5 ${
          notification.icon === 'verdict' || notification.icon === 'gavel' ? 'text-gold-400'
            : notification.icon === 'fire' ? 'text-crimson-400' : 'text-forest-400'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-ink-100 leading-snug">{notification.text}</p>
        <p className="text-xs text-ink-500 mt-1">{notification.time}</p>
      </div>
      {!notification.read && <div className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-2" />}
    </button>
  );
}
