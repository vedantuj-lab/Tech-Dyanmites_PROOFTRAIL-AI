import React, { useState } from 'react';
import { Bell, Check, Sparkles, ShieldCheck } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Review Decision Received', msg: 'Ananya Sharma approved your report "India EV Charging Market Outlook 2027".', time: '10 mins ago', type: 'SUCCESS' },
    { id: '2', title: 'New Web Source Mapped', msg: 'Retrieved 3 new policy documents for EU CBAM investigation.', time: '2 hours ago', type: 'INFO' },
    { id: '3', title: 'Citation Validation Passed', msg: 'All citations verified programmatically for Report REP_EV_2027.', time: '1 day ago', type: 'SUCCESS' },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-yellow-400" /> Notifications & Alerts
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time updates on review decisions, investigation completions, and citation validations.
          </p>
        </div>

        <button
          onClick={() => setNotifications([])}
          className="text-xs text-yellow-400 font-bold hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-[#241F0B] border border-yellow-500/30 rounded-2xl p-12 text-center text-xs text-yellow-300">
            ✓ You're all caught up! No unread notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="bg-[#241F0B] border border-yellow-500/30 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-white">{n.title}</div>
                  <span className="text-[10px] text-gray-400">{n.time}</span>
                </div>
                <p className="text-xs text-gray-300">{n.msg}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
