interface StatusPageProps {
  onNavigate: (page: string) => void;
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  lastIncident?: string;
}

const services: ServiceStatus[] = [
  { name: 'Telegram Takedowns', status: 'operational', uptime: 99.98 },
  { name: 'Instagram Takedowns', status: 'operational', uptime: 99.95 },
  { name: 'YouTube Takedowns', status: 'operational', uptime: 99.92 },
  { name: 'TikTok Takedowns', status: 'operational', uptime: 99.89 },
  { name: 'Facebook Takedowns', status: 'operational', uptime: 99.94 },
  { name: 'Twitter/X Takedowns', status: 'operational', uptime: 99.91 },
  { name: 'Payment Processing', status: 'operational', uptime: 99.99 },
  { name: 'User Dashboard', status: 'operational', uptime: 99.97 },
  { name: 'Live Chat Support', status: 'operational', uptime: 99.88 },
  { name: 'API Services', status: 'operational', uptime: 99.96 },
];

const statusConfig = {
  operational: { label: 'Operational', color: 'bg-green-500', textColor: 'text-green-400', bgLight: 'bg-green-500/10' },
  degraded: { label: 'Degraded', color: 'bg-yellow-500', textColor: 'text-yellow-400', bgLight: 'bg-yellow-500/10' },
  outage: { label: 'Outage', color: 'bg-red-500', textColor: 'text-red-400', bgLight: 'bg-red-500/10' },
  maintenance: { label: 'Maintenance', color: 'bg-blue-500', textColor: 'text-blue-400', bgLight: 'bg-blue-500/10' },
};

const incidents = [
  {
    date: 'March 18, 2026',
    title: 'Scheduled Maintenance Completed',
    description: 'Database optimization and security updates were applied successfully.',
    status: 'resolved'
  },
  {
    date: 'March 10, 2026',
    title: 'Minor Payment Gateway Delay',
    description: 'Some cryptocurrency payments experienced delays of up to 15 minutes. Issue resolved.',
    status: 'resolved'
  },
  {
    date: 'February 28, 2026',
    title: 'API Response Time Improvement',
    description: 'Upgraded servers to improve API response times by 40%.',
    status: 'resolved'
  },
];

export default function StatusPage({ onNavigate }: StatusPageProps) {
  const allOperational = services.every(s => s.status === 'operational');
  const averageUptime = (services.reduce((acc, s) => acc + s.uptime, 0) / services.length).toFixed(2);

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-20">
      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-black/5 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="text-xs sm:text-sm tracking-[0.3em] text-[#C5A572] uppercase mb-4">
            System Status
          </div>
          <h1 className="font-cormorant text-4xl sm:text-5xl text-[#0D0D0D] mb-6">
            Service <span className="italic">Status</span>
          </h1>
          
          {/* Overall Status Badge */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${allOperational ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
            <span className={`w-3 h-3 rounded-full ${allOperational ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            <span className={`font-outfit font-medium ${allOperational ? 'text-green-600' : 'text-yellow-600'}`}>
              {allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
            </span>
          </div>
          
          {/* Uptime Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-white p-4 rounded-lg border border-black/5">
              <div className="font-cormorant text-2xl text-[#C5A572]">{averageUptime}%</div>
              <div className="text-xs text-black/60 font-outfit">Avg Uptime</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-black/5">
              <div className="font-cormorant text-2xl text-[#C5A572]">0</div>
              <div className="text-xs text-black/60 font-outfit">Active Incidents</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-black/5">
              <div className="font-cormorant text-2xl text-[#C5A572]">90</div>
              <div className="text-xs text-black/60 font-outfit">Days Streak</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-cormorant text-2xl text-[#0D0D0D] mb-6">Services</h2>
          <div className="bg-white rounded-xl border border-black/5 divide-y divide-black/5">
            {services.map((service, index) => {
              const config = statusConfig[service.status];
              return (
                <div key={index} className="flex items-center justify-between p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <span className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                    <span className="font-outfit text-[#0D0D0D]">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-black/40 font-outfit hidden sm:block">
                      {service.uptime}% uptime
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-outfit ${config.bgLight} ${config.textColor}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Uptime Graph Placeholder */}
      <section className="py-12 sm:py-16 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-cormorant text-2xl text-white mb-6">90-Day Uptime</h2>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            {/* Simple visual uptime representation */}
            <div className="flex gap-0.5">
              {Array.from({ length: 90 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-8 bg-green-500/80 rounded-sm hover:bg-green-400 transition-colors cursor-pointer"
                  title={`Day ${90 - i}: 100% uptime`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-outfit text-white/40">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Past Incidents */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-cormorant text-2xl text-[#0D0D0D] mb-6">Past Incidents</h2>
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-black/5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-outfit font-medium text-[#0D0D0D]">{incident.title}</h3>
                    <p className="text-xs text-black/40 font-outfit mt-1">{incident.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-outfit">
                    Resolved
                  </span>
                </div>
                <p className="text-sm text-black/60 font-outfit">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-12 sm:py-16 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-cormorant text-2xl text-white mb-4">Get Status Updates</h2>
          <p className="font-outfit text-white/60 mb-6">
            Subscribe to receive notifications about system status and scheduled maintenance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 font-outfit focus:border-[#C5A572] outline-none"
            />
            <button className="px-6 py-3 bg-[#C5A572] text-[#0D0D0D] font-outfit font-medium rounded-lg hover:bg-[#D4AF37] transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="py-8 bg-[#FAF9F6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="font-outfit text-sm text-black/60 hover:text-[#C5A572] transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}
