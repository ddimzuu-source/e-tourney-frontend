import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings, Swords, Trophy, LayoutDashboard, Shield,
  CreditCard, Users, LogOut, Menu, Save, Moon, Bell,
  Globe, Lock, Palette, Database, RefreshCw, CheckCircle,
  Monitor, Smartphone, Mail
} from "lucide-react";

const NAV_ITEMS = [
  { id: "/",            label: "Dashboard",   icon: LayoutDashboard },
  { id: "/tournaments", label: "Tournaments", icon: Trophy },
  { id: "/teams",       label: "Teams",       icon: Shield },
  { id: "/payments",    label: "Payments",    icon: CreditCard },
  { id: "/users",       label: "Users",       icon: Users },
  { id: "/settings",    label: "Settings",    icon: Settings },
];

const user = JSON.parse(localStorage.getItem('auth_user') || '{"name":"Admin","role":"admin"}');

export default function SettingsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    appName: "E-Tourney",
    appUrl: "http://localhost:7000",
    timezone: "Asia/Jakarta",
    language: "id",
  });

  const [notif, setNotif] = useState({
    emailNewTeam: true,
    emailPayment: true,
    emailTournament: false,
    pushNotif: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "dark",
    accentColor: "emerald",
    compactMode: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? "bg-emerald-500" : "bg-white/10"}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${value ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  const Sidebar = () => (
    <aside className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#0d0d0f] border-r border-white/5 transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"}`}>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5 shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 shrink-0">
          <Swords size={16} className="text-[#0d0d0f]" />
        </div>
        {sidebarOpen && <span className="text-white font-black tracking-wider text-lg">E<span className="text-emerald-400">-</span>TOURNEY</span>}
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = id === "/settings";
          return (
            <button key={id} onClick={() => navigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative ${isActive ? "bg-gray-500/10 text-gray-300 border border-gray-500/20" : "text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent"}`}>
              {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-400 rounded-full" />}
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-white/5 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user.name?.slice(0,2).toUpperCase()}
          </div>
          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
              </div>
              <button onClick={handleLogout} className="text-gray-600 hover:text-rose-400 p-1 transition-colors"><LogOut size={15} /></button>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Sidebar />

      {/* Header */}
      <header className={`fixed top-0 right-0 z-20 h-16 flex items-center gap-4 px-5 bg-[#0d0d0f]/90 backdrop-blur border-b border-white/5 transition-all duration-300 ${sidebarOpen ? "left-64" : "left-16"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><Menu size={20} /></button>
        <div className="ml-auto flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle size={13} /> Tersimpan!
            </div>
          )}
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all active:scale-95">
            <Save size={15} /> Simpan
          </button>
        </div>
      </header>

      {/* Main */}
      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6 max-w-3xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Pengaturan <span className="text-gray-400">Sistem</span></h1>
            <p className="text-sm text-gray-500 mt-1">Konfigurasi aplikasi E-Tourney</p>
          </div>

          {/* General Settings */}
          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Globe size={18} className="text-emerald-400" />
              <h2 className="font-bold text-white">Pengaturan Umum</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { label: "Nama Aplikasi", key: "appName", placeholder: "E-Tourney" },
                { label: "URL Aplikasi", key: "appUrl", placeholder: "http://localhost:7000" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">{label}</label>
                  <input value={general[key]} onChange={e => setGeneral({ ...general, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Timezone</label>
                  <select value={general.timezone} onChange={e => setGeneral({ ...general, timezone: e.target.value })}
                    className="w-full bg-[#0d0d0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                    <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                    <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                    <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Bahasa</label>
                  <select value={general.language} onChange={e => setGeneral({ ...general, language: e.target.value })}
                    className="w-full bg-[#0d0d0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Palette size={18} className="text-violet-400" />
              <h2 className="font-bold text-white">Tampilan</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Tema</label>
                <div className="flex gap-3">
                  {[
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "light", label: "Light", icon: Monitor },
                    { value: "system", label: "System", icon: Smartphone },
                  ].map(({ value, label, icon: Icon }) => (
                    <button key={value} onClick={() => setAppearance({ ...appearance, theme: value })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${appearance.theme === value ? "bg-violet-500/10 border-violet-500/30 text-violet-400" : "border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}>
                      <Icon size={15} />{label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Warna Aksen</label>
                <div className="flex gap-2">
                  {[
                    { value: "emerald", color: "bg-emerald-500" },
                    { value: "cyan",    color: "bg-cyan-500" },
                    { value: "violet",  color: "bg-violet-500" },
                    { value: "amber",   color: "bg-amber-500" },
                    { value: "rose",    color: "bg-rose-500" },
                  ].map(({ value, color }) => (
                    <button key={value} onClick={() => setAppearance({ ...appearance, accentColor: value })}
                      className={`w-8 h-8 rounded-full ${color} transition-all ${appearance.accentColor === value ? "ring-2 ring-white ring-offset-2 ring-offset-[#111113] scale-110" : "opacity-60 hover:opacity-100"}`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">Mode Kompak</p>
                  <p className="text-xs text-gray-500">Tampilan lebih padat dan rapat</p>
                </div>
                <Toggle value={appearance.compactMode} onChange={v => setAppearance({ ...appearance, compactMode: v })} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Bell size={18} className="text-cyan-400" />
              <h2 className="font-bold text-white">Notifikasi</h2>
            </div>
            <div className="p-5 divide-y divide-white/[0.04]">
              {[
                { key: "emailNewTeam",    label: "Email - Tim Baru Mendaftar",      desc: "Notifikasi saat tim baru mendaftar turnamen" },
                { key: "emailPayment",    label: "Email - Pembayaran Masuk",         desc: "Notifikasi saat ada pembayaran baru" },
                { key: "emailTournament", label: "Email - Update Turnamen",          desc: "Notifikasi perubahan status turnamen" },
                { key: "pushNotif",       label: "Push Notification",                desc: "Notifikasi langsung di browser" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-white font-medium">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <Toggle value={notif[key]} onChange={v => setNotif({ ...notif, [key]: v })} />
                </div>
              ))}
            </div>
          </div>

          {/* Database Info */}
          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <Database size={18} className="text-amber-400" />
              <h2 className="font-bold text-white">Informasi Database</h2>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Database", value: "MongoDB Atlas" },
                { label: "Cluster", value: "Cluster0" },
                { label: "Database Name", value: "E-Tourney" },
                { label: "Status", value: "Connected", color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <span className="text-xs text-gray-500">{label}</span>
                  <span className={`text-sm font-medium ${color ?? "text-white"}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#111113] border border-rose-500/20 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-rose-500/20">
              <Lock size={18} className="text-rose-400" />
              <h2 className="font-bold text-rose-400">Zona Berbahaya</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">Logout dari Semua Device</p>
                  <p className="text-xs text-gray-500">Hapus semua sesi aktif</p>
                </div>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-semibold transition-all">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
