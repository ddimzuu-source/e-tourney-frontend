import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import api from "./api";
import { useNavigate } from "react-router-dom";
import {
  CreditCard, CheckCircle, XCircle, Clock, Loader2,
  Search, Swords, Trophy, LayoutDashboard, Shield,
  Users, Settings, LogOut, Menu, Eye, X, ImageIcon
} from "lucide-react";

// Helper function untuk membaca path/URL bukti transfer secara dinamis dari Supabase / Local
const getProofUrl = (proofPath) => {
  if (!proofPath) return null;
  if (proofPath.startsWith("http://") || proofPath.startsWith("https://")) {
    return proofPath;
  }
  return `http://127.0.0.1:8000/storage/${proofPath}`;
};

const NAV_ITEMS = [
  { id: "/",            label: "Dashboard",   icon: LayoutDashboard },
  { id: "/tournaments", label: "Tournaments", icon: Trophy },
  { id: "/teams",       label: "Teams",       icon: Shield },
  { id: "/payments",    label: "Payments",    icon: CreditCard },
  { id: "/users",       label: "Users",       icon: Users },
  { id: "/settings",    label: "Settings",    icon: Settings },
];

const statusConfig = {
  pending:  { label: "Pending",  icon: Clock,       text: "text-amber-400",   border: "border-amber-500/30",   bg: "bg-amber-500/10"  },
  paid:     { label: "Paid",     icon: CheckCircle, text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  rejected: { label: "Rejected", icon: XCircle,     text: "text-rose-400",    border: "border-rose-500/30",    bg: "bg-rose-500/10"    },
};

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal state
  const [viewData, setViewData] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    document.title = "E-Tourney - Kelola Pembayaran";
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payments");
      setPayments(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Fetch payments error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setActionLoading(true);
      await api.put(`/payments/${id}`, { status: newStatus });
      
      setPayments(prev => prev.map(p => {
        const pId = p.id || p._id;
        return pId === id ? { ...p, status: newStatus } : p;
      }));
      
      if (viewData) {
        setViewData(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Update status error:", err);
      alert(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    const teamName = p.team?.name?.toLowerCase() || "";
    const tournamentName = p.tournament?.name?.toLowerCase() || "";
    const matchesSearch = teamName.includes(search.toLowerCase()) || tournamentName.includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#0d1f1a] font-sans text-emerald-100">
      {/* Sidebar Desktop */}
      <div className="hidden md:block w-64 shrink-0">
        <Sidebar currentPath="/payments" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-[#0a1a14] border-b border-[#1a3d30]">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-emerald-400 hover:bg-[#1a3d30] rounded-lg">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <CreditCard className="text-emerald-500" size={24} />
              <h1 className="text-xl font-bold text-white tracking-wide uppercase">Kelola Pembayaran</h1>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* Controls: Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0a1a14] p-4 rounded-xl border border-[#1a3d30]">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-2.5 text-emerald-500/50" size={16} />
              <input type="text" placeholder="Cari tim / turnamen..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#0d1f1a] border border-[#1a3d30] rounded-lg text-sm text-white placeholder-emerald-500/30 focus:outline-none focus:border-emerald-500/60 transition-colors" />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["all", "pending", "paid", "rejected"].map((st) => (
                <button key={st} onClick={() => setFilterStatus(st)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterStatus === st 
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" 
                      : "bg-[#0d1f1a] border border-[#1a3d30] text-emerald-400 hover:bg-[#1a3d30]"
                  }`}>
                  {st === "all" ? "Semua" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#0a1a14] rounded-xl border border-[#1a3d30] overflow-hidden shadow-xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="text-emerald-500 animate-spin" size={32} />
                <p className="text-sm text-emerald-500/50">Memuat data pembayaran...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-16 text-emerald-500/40 text-sm">
                Tidak ada data pembayaran ditemukan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#1a3d30] bg-[#0d1f1a]/50 text-xs font-bold uppercase tracking-wider text-emerald-400/70">
                      <th className="px-6 py-4">Nama Tim</th>
                      <th className="px-6 py-4">Turnamen</th>
                      <th className="px-6 py-4">Jumlah</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a3d30]">
                    {filteredPayments.map((p) => {
                      const currentStatus = (p.status || "pending").toLowerCase();
                      const cfg = statusConfig[currentStatus] || statusConfig.pending;
                      const StatusIcon = cfg.icon;

                      return (
                        <tr key={p.id || p._id} className="hover:bg-[#0d1f1a]/30 transition-colors text-sm text-emerald-100/90">
                          <td className="px-6 py-4 font-semibold text-white">{p.team?.name || "Tim Tidak Diketahui"}</td>
                          <td className="px-6 py-4 text-emerald-100/60">{p.tournament?.name || "Turnamen N/A"}</td>
                          <td className="px-6 py-4 font-mono text-emerald-400 font-semibold">
                            Rp {(p.amount || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                              <StatusIcon size={12} /> {cfg.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setViewData(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1f1a] border border-[#1a3d30] text-emerald-400 hover:text-white hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all text-xs font-semibold">
                              <Eye size={14} /> Detail
                            </button>
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
      </div>

      {/* Detail Modal Component */}
      {viewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0a1a14] border border-[#1a3d30] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0d1f1a]">
              <h2 className="text-md font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <CreditCard size={18} className="text-emerald-500" /> Detail Transaksi
              </h2>
              <button onClick={() => setViewData(null)} className="p-1.5 text-emerald-500/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4 bg-[#0d1f1a]/50 p-4 rounded-xl border border-white/5">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-500/40 font-bold block mb-0.5">Nama Tim</span>
                  <span className="text-sm font-semibold text-white">{viewData.team?.name || "-"}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-500/40 font-bold block mb-0.5">Turnamen</span>
                  <span className="text-sm font-semibold text-emerald-100/80">{viewData.tournament?.name || "-"}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] uppercase tracking-wider text-emerald-500/40 font-bold block mb-0.5">Total Nominal</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">Rp {(viewData.amount || 0).toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Bukti Gambar Section */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-emerald-500/40 font-bold block">Bukti Transfer</span>
                
                {viewData.proof_path || viewData.proof_image ? (
                  <div className="relative rounded-xl border border-[#1a3d30] bg-black/40 overflow-hidden group max-h-[260px] flex items-center justify-center">
                    <img 
                      src={getProofUrl(viewData.proof_path || viewData.proof_image)} 
                      alt="Bukti Transfer" 
                      className="w-full h-auto max-h-[260px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400/0a1a14/10b981?text=Gambar+Gagal+Dimuat";
                      }}
                    />
                    <a 
                      href={getProofUrl(viewData.proof_path || viewData.proof_image)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 text-xs font-semibold text-white gap-1.5"
                    >
                      <Eye size={14} /> Lihat Ukuran Penuh
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-[#1a3d30] bg-[#0d1f1a]/20 text-emerald-500/30 gap-2">
                    <ImageIcon size={28} className="stroke-[1.5]" />
                    <span className="text-xs">Belum ada bukti transfer yang diunggah</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons (Hanya jika pending) */}
            {viewData.status?.toLowerCase() === "pending" && (
              <div className="flex gap-3 px-6 py-4 border-t border-white/5 bg-[#0d1f1a]/40">
                <button 
                  onClick={() => handleUpdateStatus(viewData.id || viewData._id, "rejected")}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold hover:bg-rose-500/20 transition-all disabled:opacity-50"
                >
                  Tolak
                </button>
                <button 
                  onClick={() => handleUpdateStatus(viewData.id || viewData._id, "paid")}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold shadow-lg shadow-emerald-500/10 transition-all disabled:opacity-50 active:scale-[0.98]"
                >
                  Konfirmasi
                </button>
              </div>
            )}
            
            {viewData.status?.toLowerCase() !== "pending" && (
              <div className="px-6 py-4 border-t border-white/5 bg-[#0d1f1a]/40">
                <div className={`text-center py-2.5 rounded-lg text-sm font-semibold border ${
                  viewData.status?.toLowerCase() === "paid" 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}>
                  Status Pembayaran: {viewData.status?.toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Back-drop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-64 max-w-xs bg-[#0a1a14] h-full flex flex-col border-r border-[#1a3d30] animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3d30]">
              <div className="flex items-center gap-2 text-white font-black tracking-wider text-sm">
                <Swords className="text-emerald-500" size={18} /> E-TOURNEY
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-emerald-400 p-1">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = item.id === "/payments";
                return (
                  <button key={item.id} onClick={() => { navigate(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10" : "text-emerald-400/70 hover:bg-[#1a3d30] hover:text-emerald-300"
                    }`}>
                    <Icon size={16} /> {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="p-4 border-t border-[#1a3d30]">
              <button onClick={() => { localStorage.clear(); navigate("/login"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-400/80 hover:bg-rose-500/10 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}