import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LoginLog {
  id: string;
  user_id: string;
  email: string;
  login_at: string;
  user_agent: string;
}

interface Props {
  users: any[];
}

export default function AdminLoginLogs({ users }: Props) {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    const { data } = await supabase
      .from('login_logs')
      .select('*')
      .order('login_at', { ascending: false })
      .limit(100);
    
    setLogs(data || []);
    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const getDeviceInfo = (ua: string) => {
    if (!ua) return { device: 'Unknown', browser: 'Unknown' };
    
    let device = 'Desktop';
    if (/iPhone|iPad/.test(ua)) device = '📱 iPhone/iPad';
    else if (/Android/.test(ua)) device = '📱 Android';
    else if (/Mac/.test(ua)) device = '💻 Mac';
    else if (/Windows/.test(ua)) device = '💻 Windows';
    else if (/Linux/.test(ua)) device = '🐧 Linux';

    let browser = 'Other';
    if (/Chrome/.test(ua) && !/Edge/.test(ua)) browser = 'Chrome';
    else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/Firefox/.test(ua)) browser = 'Firefox';
    else if (/Edge/.test(ua)) browser = 'Edge';

    return { device, browser };
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.full_name || 'Unknown';
  };

  // Get unique users who logged in today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLogs = logs.filter(l => new Date(l.login_at) >= today);
  const todayUniqueUsers = new Set(todayLogs.map(l => l.user_id)).size;

  // Get unique users in last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekLogs = logs.filter(l => new Date(l.login_at) >= weekAgo);
  const weekUniqueUsers = new Set(weekLogs.map(l => l.user_id)).size;

  if (loading) {
    return <div className="text-center py-8 text-white/60">Loading login logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-lg font-medium mb-2">🔐 Login Activity</h2>
        <p className="text-white/60 text-sm">Track all user login activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <p className="text-green-400 text-3xl font-bold">{todayUniqueUsers}</p>
          <p className="text-green-400/60 text-xs mt-1">Active Today</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <p className="text-blue-400 text-3xl font-bold">{weekUniqueUsers}</p>
          <p className="text-blue-400/60 text-xs mt-1">Active This Week</p>
        </div>
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-center">
          <p className="text-gold text-3xl font-bold">{logs.length}</p>
          <p className="text-gold/60 text-xs mt-1">Total Logins</p>
        </div>
      </div>

      {/* Today's Active Users */}
      {todayLogs.length > 0 && (
        <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
          <h3 className="text-green-400 font-medium mb-3">🟢 Active Today ({todayUniqueUsers} users)</h3>
          <div className="flex flex-wrap gap-2">
            {[...new Set(todayLogs.map(l => l.email))].map(email => (
              <span key={email} className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                {email}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Login Logs Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">Recent Logins</h3>
          <button onClick={loadLogs} className="text-gold text-sm hover:underline">Refresh</button>
        </div>
        
        {logs.length === 0 ? (
          <div className="text-center py-12 text-white/40">No login records yet</div>
        ) : (
          <div className="space-y-2">
            {logs.map(log => {
              const { device, browser } = getDeviceInfo(log.user_agent);
              const isToday = new Date(log.login_at) >= today;
              
              return (
                <div key={log.id} className={`p-4 rounded-xl border transition-all ${
                  isToday 
                    ? 'bg-green-500/5 border-green-500/20' 
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">
                        {log.email[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{getUserName(log.user_id)}</p>
                          {isToday && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                        </div>
                        <p className="text-white/60 text-sm">{log.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">{formatDate(log.login_at)}</p>
                      <p className="text-white/40 text-xs">{device} • {browser}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
