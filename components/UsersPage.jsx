import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users, UserCircle, Shield, Crown, Search, Menu,
  Swords, Trophy, LayoutDashboard, CreditCard, Settings,
  LogOut, Loader2, Mail, Phone, Edit3, Trash2, Plus, X,
  CheckCircle, AlertCircle
} from "lucide-react";

const API_BASE = "/api";

const NAV_ITEMS = [
  { id: "/",            label: "Dashboard",   icon: LayoutDashboard },
  { id: "/tournaments", label: "Tournaments", icon: Trophy },
  { id: "/teams",       label: "Teams",       icon: Shield },
  { id: "/payments",    label: "Payments",    icon: CreditCard },
  { id: "/users",       label: "Users",       icon: Users },
  { id: "/settings",    label: "Settings",    icon: Settings },
];

const roleConfig = {
  admin:   { label: "Admin",    bg: "bg-rose-500/10",    border: "border-rose-500/30",    text: "text-rose-400",    icon: Crown },
  panitia: { label: "Panitia",  bg: "bg-violet-500/10",  border: "border-violet-500/30",  text: "text-violet-400",  icon: Shield },
  peserta: { label: "Peserta",  bg: "bg-cyan-500/10",    border: "border-cyan-500/30",    text: "text-cyan-400",    icon: UserCircle },
};

const avatarColors = [
  "from-emerald-500 to-cyan-500",
  "from-violet-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-violet-500",
];

export default function UsersPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filterRole, setFilterRole]   = useState("all");
  const [editData, setEditData]       = useState(null);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`${API_BASE}/users`)
      .then (res => setUsers(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus user ini?")) return;
    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      showToast("User berhasil dihapus");
      fetchUsers();
    } catch { showToast("Gagal menghapus user", "error"); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_BASE}/users/${editData.id}`, {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        role: editData.role,
      });
      showToast("User berhasil diupdate");
      setEditData(null);
      fetchUsers();
    } catch { showToast("Gagal mengupdate user", "error"); }
    finally { setSaving(false); }
  };

  const filtered = users.filter(u => {
    const matchSearch = String(u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
                        String(u.email ?? "").toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

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
          const isActive = id === "/users";
          return (
            <button key={id} onClick={() => navigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative ${isActive ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent"}`}>
              {isActive && <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-cyan-400 rounded-full" />}
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </button>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-white/5 p-3">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shrink-0">AD</div>
          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Admin Utama</p>
                <p className="text-xs text-cyan-400">Administrator</p>
              </div>
              <button className="text-gray-600 hover:text-rose-400 p-1"><LogOut size={15} /></button>
            </>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Sidebar />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold shadow-xl transition-all ${toast.type === "error" ? "bg-rose-500/10 border-rose-500/30 text-rose-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"}`}>
          {toast.type === "error" ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
          {toast.msg}
        </div>
      )}

      <header className={`fixed top-0 right-0 z-20 h-16 flex items-center gap-4 px-5 bg-[#0d0d0f]/90 backdrop-blur border-b border-white/5 transition-all duration-300 ${sidebarOpen ? "left-64" : "left-16"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><Menu size={20} /></button>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari user..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {["all", "admin", "panitia", "peserta"].map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${filterRole === r ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400" : "text-gray-500 hover:text-gray-300 border border-transparent hover:bg-white/5"}`}>
              {r === "all" ? "Semua" : r}
            </button>
          ))}
        </div>
      </header>

      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6 max-w-screen-2xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white">Manajemen <span className="text-cyan-400">Users</span></h1>
              <p className="text-sm text-gray-500 mt-1">{filtered.length} user ditemukan</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total Admin",   count: users.filter(u => u.role === "admin").length,   color: "rose" },
              { label: "Total Panitia", count: users.filter(u => u.role === "panitia").length, color: "violet" },
              { label: "Total Peserta", count: users.filter(u => u.role === "peserta").length, color: "cyan" },
            ].map(({ label, count, color }) => (
              <div key={label} className={`bg-[#111113] border border-${color}-500/20 rounded-xl p-4`}>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-xl font-black text-${color}-400`}>{count}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
                <Loader2 size={20} className="animate-spin" /><span>Memuat data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p>Belum ada user</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["User", "Email", "Phone", "Role", "Aksi"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filtered.map((u, i) => {
                      const rc = roleConfig[u.role] ?? roleConfig.peserta;
                      const RoleIcon = rc.icon;
                      return (
                        <tr key={u.id ?? i} className="hover:bg-white/[0.025] transition-colors group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-black text-white shrink-0`}>
                                {String(u.name ?? "?").slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">{u.name ?? "-"}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            <div className="flex items-center gap-1.5"><Mail size={12} />{u.email ?? "-"}</div>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">
                            <div className="flex items-center gap-1.5"><Phone size={12} />{u.phone ?? "-"}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${rc.bg} ${rc.border} ${rc.text}`}>
                              <RoleIcon size={11} />{rc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setEditData({ ...u })} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-cyan-400 transition-colors" title="Edit"><Edit3 size={15} /></button>
                              <button onClick={() => handleDelete(u.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-rose-400 transition-colors" title="Hapus"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Edit User */}
      {editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Edit User</h2>
              <button onClick={() => setEditData(null)} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Nama",  key: "name",  type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1.5 block uppercase tracking-wider">{label}</label>
                  <input type={type} value={editData[key] ?? ""} onChange={e => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block uppercase tracking-wider">Role</label>
                <select value={editData.role ?? "peserta"} onChange={e => setEditData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                  <option value="admin">Admin</option>
                  <option value="panitia">Panitia</option>
                  <option value="peserta">Peserta</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-white/5">
              <button onClick={() => setEditData(null)} className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 text-sm font-semibold hover:bg-white/5">Batal</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/30 disabled:opacity-50">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
