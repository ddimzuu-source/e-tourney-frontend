import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import Sidebar from "./Sidebar";
import {
  Trophy, Users, CreditCard, Search, Bell,
  Plus, Eye, Edit3, Sliders, Shield, Clock, TrendingUp,
  Menu, X, Zap, Loader2
} from "lucide-react";

const formatRupiah = (num) => "Rp " + Number(num || 0).toLocaleString("id-ID");

const gameTagColors = {
  MLBB: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PUBG: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  VAL:  "bg-rose-500/20 text-rose-400 border-rose-500/30",
  FF:   "bg-orange-500/20 text-orange-400 border-orange-500/30",
  D2:   "bg-red-600/20 text-red-400 border-red-500/30",
};

const statusConfig = {
  open:         { label: "Open",         dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  registration: { label: "Registration", dot: "bg-cyan-400",    text: "text-cyan-400",    border: "border-cyan-500/30",    bg: "bg-cyan-500/10"    },
  ongoing:      { label: "Ongoing",      dot: "bg-violet-400",  text: "text-violet-400",  border: "border-violet-500/30",  bg: "bg-violet-500/10"  },
  finished:     { label: "Finished",     dot: "bg-gray-400",    text: "text-gray-400",    border: "border-gray-500/30",    bg: "bg-gray-500/10"    },
};

const avatarColors = [
  "from-emerald-500 to-cyan-500", "from-violet-500 to-pink-500",
  "from-cyan-500 to-blue-500",    "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",    "from-emerald-500 to-teal-500",
  "from-indigo-500 to-violet-500",
];

export default function ETourneyDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifCount]                  = useState(5);
  const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");

  const [stats, setStats]             = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [recentRegs, setRecentRegs]   = useState([]);
  const [loadingStats, setLoadingStats]             = useState(true);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingRegs, setLoadingRegs]               = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats")
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoadingStats(false));

    api.get("/tournaments")
      .then(res => setTournaments(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .catch(console.error)
      .finally(() => setLoadingTournaments(false));

    api.get("/dashboard/recent-registrations")
      .then(res => setRecentRegs(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .catch(console.error)
      .finally(() => setLoadingRegs(false));
  }, []);

  const statsCards = [
    { label: "Total Turnamen",   value: loadingStats ? "..." : stats?.total_tournaments ?? 0, icon: Trophy,     iconBg: "bg-emerald-500/10", iconColor: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/20" },
    { label: "Total Tim",        value: loadingStats ? "..." : stats?.total_teams ?? 0,       icon: Shield,     iconBg: "bg-cyan-500/10",    iconColor: "text-cyan-400",    border: "border-cyan-500/20",    glow: "shadow-cyan-500/20"    },
    { label: "Total Pemain",     value: loadingStats ? "..." : stats?.total_users ?? 0,       icon: Users,      iconBg: "bg-violet-500/10",  iconColor: "text-violet-400",  border: "border-violet-500/20",  glow: "shadow-violet-500/20"  },
    { label: "Total Pendapatan", value: loadingStats ? "..." : formatRupiah(stats?.total_revenue ?? 0), icon: CreditCard, iconBg: "bg-amber-500/10", iconColor: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/20" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] font-sans text-white antialiased">
      <Sidebar open={sidebarOpen} />

      {/* Topbar */}
      <header className={`fixed top-0 right-0 z-20 h-16 flex items-center gap-4 px-5 bg-[#0d0d0f]/90 backdrop-blur border-b border-white/5 transition-all duration-300 ${sidebarOpen ? "left-64" : "left-0 md:left-16"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex-1 max-w-sm relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari turnamen, tim, pemain..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all" />
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Server Online</span>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
            <Bell size={18} />
            {notifCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{notifCount}</span>}
          </button>
        </div>
      </header>

      <main className={`transition-all duration-300 pt-16 min-h-screen ${sidebarOpen ? "ml-64" : "ml-0 md:ml-16"}`}>
        <div className="p-5 lg:p-7 max-w-screen-2xl mx-auto space-y-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Dashboard <span className="text-emerald-400">Overview</span></h1>
              <p className="text-sm text-gray-500 mt-1">
                Selamat datang kembali, <span className="text-white font-semibold">{authUser.name ?? "Admin"}</span> ·{" "}
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp size={14} className="text-emerald-400" />
              <span>Data langsung dari MongoDB Atlas</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {statsCards.map(({ label, value, icon: Icon, iconBg, iconColor, border, glow }) => (
              <div key={label} className={`bg-[#111113] border ${border} rounded-xl p-5 shadow-lg ${glow} hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-2xl font-black text-white mt-1">{value}</p>
                  </div>
                  <div className={`${iconBg} p-3 rounded-xl border ${border}`}>
                    <Icon size={20} className={iconColor} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Tournaments Table */}
            <div className="xl:col-span-2 bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div>
                  <h2 className="text-base font-bold text-white">Turnamen Aktif & Mendatang</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{tournaments.length} turnamen ditemukan</p>
                </div>
                <button onClick={() => navigate("/tournaments")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all active:scale-95">
                  <Plus size={15} /><span className="hidden sm:inline">Buat Turnamen</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                {loadingTournaments ? (
                  <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
                    <Loader2 size={20} className="animate-spin" /><span className="text-sm">Memuat data...</span>
                  </div>
                ) : tournaments.length === 0 ? (
                  <div className="text-center py-16 text-gray-600 text-sm">Belum ada turnamen</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5 text-left">
                        {["Nama Turnamen", "Game", "Slot Tim", "Biaya Daftar", "Status", "Aksi"].map((h) => (
                          <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {tournaments.map((t) => {
                        const sc = statusConfig[t.status] ?? statusConfig.open;
                        const slotsUsed  = t.slots_used ?? 0;
                        const slotsTotal = t.max_teams ?? 0;
                        const slotPct    = slotsTotal > 0 ? Math.round((slotsUsed / slotsTotal) * 100) : 0;
                        const tagCls     = gameTagColors[t.game_tag] ?? "bg-gray-700/30 text-gray-400 border-gray-600/30";
                        return (
                          <tr key={t.id} className="hover:bg-white/[0.025] transition-colors group">
                            <td className="px-5 py-3.5">
                            <p className="font-semibold text-white">{t.name}</p>
                            <p className="text-xs text-gray-600 mt-0.5">Mulai: {t.start_date} · Hadiah: {t.prize ?? '-'}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${gameTagColors[t.game_tag] ?? "bg-gray-700/30 text-gray-400 border-gray-600/30"}`}>
                                {t.game_tag ?? t.game ?? '—'}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-white font-semibold">{slotsUsed}/{slotsTotal}</span>
                              <div className="mt-1.5 w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${slotPct >= 100 ? "bg-rose-500" : slotPct > 70 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${slotPct}%` }} />
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-gray-300 font-medium whitespace-nowrap">{formatRupiah(t.registration_fee)}</td>
                            <td className="px-5 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.border} ${sc.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-cyan-400 transition-colors"><Eye size={15} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-violet-400 transition-colors"><Sliders size={15} /></button>
                                <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-amber-400 transition-colors"><Edit3 size={15} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="xl:col-span-1 bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div>
                  <h2 className="text-base font-bold text-white">Pendaftaran Terbaru</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Update real-time</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Zap size={13} className="animate-pulse" /><span className="text-xs font-semibold">Live</span>
                </div>
              </div>
              {loadingRegs ? (
                <div className="flex items-center justify-center py-10 gap-3 text-gray-500">
                  <Loader2 size={18} className="animate-spin" /><span className="text-sm">Memuat...</span>
                </div>
              ) : recentRegs.length === 0 ? (
                <div className="text-center py-10 text-gray-600 text-sm">Belum ada pendaftaran</div>
              ) : (
                <ul className="divide-y divide-white/[0.04]">
                  {recentRegs.map((reg, i) => (
                    <li key={reg._id ?? i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.025] transition-colors">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                        {reg.name?.slice(0, 2).toUpperCase() ?? "TM"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-semibold truncate">{reg.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">mendaftar di <span className="text-gray-400">{reg.tournament_id ?? '-'}</span></p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 shrink-0 mt-0.5">
                        <Clock size={11} />
                        <span className="text-xs whitespace-nowrap">{reg.registered_at ? new Date(reg.registered_at).toLocaleDateString("id-ID") : '-'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="px-5 py-3 border-t border-white/5">
                <button onClick={() => navigate("/teams")} className="w-full text-xs text-gray-500 hover:text-emerald-400 transition-colors font-medium py-1">
                  Lihat semua pendaftaran →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
