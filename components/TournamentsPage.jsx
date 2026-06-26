import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import api from "./api";
import { useNavigate, Link } from "react-router-dom";
import {
  Trophy, Plus, Eye, Edit3, Trash2, X, Save,
  Loader2, Search, ChevronLeft, Swords, LayoutDashboard,
  Shield, CreditCard, Users, Settings, LogOut, Menu
} from "lucide-react";


const statusConfig = {
  open:         { label: "Open",         dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  registration: { label: "Registration", dot: "bg-cyan-400",    text: "text-cyan-400",    border: "border-cyan-500/30",    bg: "bg-cyan-500/10"    },
  ongoing:      { label: "Ongoing",      dot: "bg-violet-400",  text: "text-violet-400",  border: "border-violet-500/30",  bg: "bg-violet-500/10"  },
  finished:     { label: "Finished",     dot: "bg-gray-400",    text: "text-gray-400",    border: "border-gray-500/30",    bg: "bg-gray-500/10"    },
};

const NAV_ITEMS = [
  { id: "/",            label: "Dashboard",   icon: LayoutDashboard },
  { id: "/tournaments", label: "Tournaments", icon: Trophy },
  { id: "/teams",       label: "Teams",       icon: Shield },
  { id: "/payments",    label: "Payments",    icon: CreditCard },
  { id: "/users",       label: "Users",       icon: Users },
  { id: "/settings",    label: "Settings",    icon: Settings },
];

const EMPTY_FORM = {
  name: "", game: "", game_tag: "", max_teams: "",
  registration_fee: "", prize: "", start_date: "",
  end_date: "", status: "open", description: "",
  min_members: "",
};

// Preset min_members berdasarkan game populer
const GAME_PRESETS = {
  "mobile legends": 5,
  "mlbb": 5,
  "valorant": 5,
  "free fire": 4,
  "ff": 4,
  "pubg mobile": 4,
  "pubg": 4,
  "efootball": 1,
  "e-football": 1,
  "fifa": 1,
  "chess": 1,
};

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editData, setEditData]       = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [saving, setSaving]           = useState(false);
  const [deleteId, setDeleteId]       = useState(null);

  const fetchTournaments = () => {
    setLoading(true);
    api.get(`/tournaments`)
      .then(res => setTournaments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTournaments(); }, []);

  const filtered = tournaments.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.game?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY_FORM); setEditData(null); setShowModal(true); };
  const openEdit   = (t) => { setForm({ ...EMPTY_FORM, ...t }); setEditData(t); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditData(null); setForm(EMPTY_FORM); };

  // Auto-fill min_members berdasarkan nama game
  const handleGameChange = (value) => {
    const preset = GAME_PRESETS[value.toLowerCase()];
    setForm(prev => ({
      ...prev,
      game: value,
      min_members: preset ? String(preset) : prev.min_members,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, min_members: form.min_members ? Number(form.min_members) : null };
      if (editData) {
        await api.put(`/tournaments/${editData.id || editData._id}`, payload);
      } else {
        await api.post(`/tournaments`, payload);
      }
      fetchTournaments();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tournaments/${id}`);
      fetchTournaments();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

 

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <Sidebar open={sidebarOpen} />

      <header className={`fixed top-0 right-0 z-20 h-16 flex items-center gap-4 px-5 bg-[#0d0d0f]/90 backdrop-blur border-b border-white/5 transition-all duration-300 ${sidebarOpen ? "left-64" : "left-16"}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5">
          <Menu size={20} />
        </button>
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari turnamen..."
            className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
        </div>
        <button onClick={openCreate}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all active:scale-95">
          <Plus size={15} /> Buat Turnamen
        </button>
      </header>

      <main className={`pt-16 min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <div className="p-6 max-w-screen-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white">Manajemen <span className="text-emerald-400">Turnamen</span></h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} turnamen ditemukan</p>
          </div>

          <div className="bg-[#111113] border border-white/5 rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
                <Loader2 size={20} className="animate-spin" /><span>Memuat data...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-600">
                <Trophy size={40} className="mx-auto mb-3 opacity-30" />
                <p>Belum ada turnamen</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Nama Turnamen", "Game", "Slot", "Min. Anggota", "Biaya Daftar", "Hadiah", "Status", "Aksi"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filtered.map(t => {
                      const sc = statusConfig[t.status] ?? statusConfig.open;
                      return (
                        <tr key={t.id || t._id} className="hover:bg-white/[0.025] transition-colors group">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-white group-hover:text-emerald-300 transition-colors">{t.name}</p>
                            <p className="text-xs text-gray-600 mt-0.5">Mulai: {t.start_date} · Hadiah: {t.prize ?? "-"}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {t.game_tag ?? t.game}
                            </span>
                            <p className="text-xs text-gray-600 mt-1">{t.game}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-white font-semibold">{t.slots_used ?? 0}/{t.max_teams}</span>
                          </td>
                          <td className="px-5 py-4">
                            {t.min_members ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                {t.min_members} orang
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-gray-300">
                            Rp {Number(t.registration_fee || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-5 py-4 text-gray-300">{t.prize ?? "-"}</td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.border} ${sc.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <Link to={`/tournaments/${t._id || t.id}/bracket`} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-emerald-400 transition-colors" title="Lihat Bagan">
                                <Eye size={15} />
                              </Link>
                              <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-amber-400 transition-colors" title="Edit">
                                <Edit3 size={15} />
                              </button>
                              <button onClick={() => setDeleteId(t.id || t._id)} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-rose-400 transition-colors" title="Hapus">
                                <Trash2 size={15} />
                              </button>
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

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">{editData ? "Edit Turnamen" : "Buat Turnamen Baru"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-white p-1"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Nama Turnamen</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="FREE FIRE CHAMP" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
              </div>

              {/* Game — auto-fill min_members */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Game</label>
                <input type="text" value={form.game} onChange={e => handleGameChange(e.target.value)}
                  placeholder="Free Fire" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
              </div>

              {/* Game Tag */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Game Tag</label>
                <input type="text" value={form.game_tag} onChange={e => setForm({ ...form, game_tag: e.target.value })}
                  placeholder="FF" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
              </div>

              {/* Min Members + Max Teams side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                    Min. Anggota Tim
                    <span className="ml-1 text-cyan-400">(validasi daftar)</span>
                  </label>
                  <input type="number" min="1" value={form.min_members} onChange={e => setForm({ ...form, min_members: e.target.value })}
                    placeholder="5"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
                  <p className="text-xs text-gray-600 mt-1">MLBB=5, FF=4, Valorant=5</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Max Tim</label>
                  <input type="number" value={form.max_teams} onChange={e => setForm({ ...form, max_teams: e.target.value })}
                    placeholder="8" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>

              {/* Biaya + Hadiah */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Biaya Pendaftaran (Rp)</label>
                  <input type="number" value={form.registration_fee} onChange={e => setForm({ ...form, registration_fee: e.target.value })}
                    placeholder="10000" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Hadiah</label>
                  <input type="text" value={form.prize} onChange={e => setForm({ ...form, prize: e.target.value })}
                    placeholder="Rp 1.000.000" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tanggal Mulai</label>
                  <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tanggal Selesai</label>
                  <input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-[#0d0d0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                  <option value="open">Open</option>
                  <option value="registration">Registration</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="finished">Finished</option>
                </select>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Deskripsi</label>
                <textarea value={form.description ?? ""} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="Deskripsi turnamen..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 resize-none" />
              </div>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-t border-white/5">
              <button onClick={closeModal} className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-colors">
                Batal
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-sm font-semibold transition-all disabled:opacity-50">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-sm p-6 text-center">
            <Trash2 size={40} className="mx-auto mb-3 text-rose-400" />
            <h2 className="text-lg font-bold text-white mb-2">Hapus Turnamen?</h2>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white text-sm font-semibold">Batal</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 text-sm font-semibold">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
