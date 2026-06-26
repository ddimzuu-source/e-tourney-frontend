import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import api from "./api";
import { useNavigate } from "react-router-dom";
import {
  Shield, Plus, Edit3, Trash2, X, Save, Loader2,
  Search, Swords, Trophy, LayoutDashboard, CreditCard,
  Users, Settings, LogOut, Menu, CheckCircle, Clock
} from "lucide-react";


const NAV_ITEMS = [
  { id: "/",            label: "Dashboard",   icon: LayoutDashboard },
  { id: "/tournaments", label: "Tournaments", icon: Trophy },
  { id: "/teams",       label: "Teams",       icon: Shield },
  { id: "/payments",    label: "Payments",    icon: CreditCard },
  { id: "/users",       label: "Users",       icon: Users },
  { id: "/settings",    label: "Settings",    icon: Settings },
];

const statusConfig = {
  pending:  { label: "Pending",  dot: "bg-amber-400",   text: "text-amber-400",   border: "border-amber-500/30",   bg: "bg-amber-500/10"  },
  approved: { label: "Approved", dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  rejected: { label: "Rejected", dot: "bg-rose-400",    text: "text-rose-400",    border: "border-rose-500/30",    bg: "bg-rose-500/10"   },
};

const EMPTY_FORM = { name: "", tournament_id: "", captain_id: "", members: "", status: "pending" };

export default function TeamsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [teams, setTeams]             = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editData, setEditData]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState(null);

  const fetchTeams = () => {
    setLoading(true);
    api.get(`/teams`)
      .then(res => setTeams(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTeams();
    api.get(`/tournaments`).then(res => setTournaments(res.data));
  }, []);

  const filtered = teams.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY_FORM); setEditData(null); setShowModal(true); };
  const openEdit   = (t) => { setForm({ ...EMPTY_FORM, ...t, members: Array.isArray(t.members) ? t.members.join(", ") : t.members }); setEditData(t); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditData(null); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, members: form.members.split(",").map(m => m.trim()).filter(Boolean) };
      if (editData) {
        await api.put(`/teams/${editData.id}`, payload);
      } else {
        await api.post(`/teams`, payload);
      }
      fetchTeams();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await  api.delete(`/teams/${id}`);
      fetchTeams();
      setDeleteId(null);
    } catch (err) { console.error(err); }
  };

  

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Sidebar open={sidebarOpen} />
      <header className={`fixed top-0 right-0 z-20 h-16 flex items-center gap-4 px-5 bg-[#0d0d0f]/90 backdrop-blur border-b border-white/5 transition-all duration-300 ${sidebarOpen ? "left-64" : "left-16"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5"><Menu size={20} /></button>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari tim..."
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
        </div>
        <button onClick={openCreate}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-semibold transition-all active:scale-95">
          <Plus size={15} /> Tambah Tim
        </button>
      </header>

      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6 max-w-screen-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Manajemen <span className="text-cyan-400">Tim</span></h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} tim ditemukan</p>
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
                <Loader2 size={20} className="animate-spin" /><span>Memuat data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <Shield size={40} className="mx-auto mb-3 opacity-30" />
                <p>Belum ada tim</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Nama Tim", "Turnamen", "Kapten", "Anggota", "Status", "Daftar", "Aksi"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filtered.map(t => {
                      const sc = statusConfig[t.status] ?? statusConfig.pending;
                      return (
                        <tr key={t.id} className="hover:bg-white/[0.025] transition-colors group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                {t.name?.slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors">{t.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-gray-400 text-xs">{t.tournament_id ?? "-"}</td>
                          <td className="px-5 py-4 text-gray-300">{t.captain_id ?? "-"}</td>
                          <td className="px-5 py-4 text-gray-300">{Array.isArray(t.members) ? t.members.length : 0} pemain</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.border} ${sc.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-xs">
                            {t.registered_at ? new Date(t.registered_at).toLocaleDateString("id-ID") : "-"}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-amber-400 transition-colors"><Edit3 size={15} /></button>
                              <button onClick={() => setDeleteId(t.id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-rose-400 transition-colors"><Trash2 size={15} /></button>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editData ? "Edit Tim" : "Tambah Tim Baru"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Nama Tim</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Shadow Wolves"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Turnamen</label>
                <select value={form.tournament_id} onChange={e => setForm({ ...form, tournament_id: e.target.value })}
                  className="w-full bg-[#0d0d0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                  <option value="">Pilih Turnamen</option>
                  {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">ID Kapten</label>
                <input value={form.captain_id} onChange={e => setForm({ ...form, captain_id: e.target.value })} placeholder="user_id kapten"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Anggota (pisahkan dengan koma)</label>
                <textarea value={form.members} onChange={e => setForm({ ...form, members: e.target.value })}
                  rows={3} placeholder="player1, player2, player3..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-[#0d0d0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-white/5">
              <button onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm font-semibold">Batal</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 text-sm font-semibold disabled:opacity-50">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center">
            <Trash2 size={40} className="mx-auto mb-3 text-rose-400" />
            <h2 className="text-lg font-bold text-white mb-2">Hapus Tim?</h2>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 text-sm font-semibold">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
