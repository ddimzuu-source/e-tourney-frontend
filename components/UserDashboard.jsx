import { useState, useEffect } from "react";
import api from "./api"; 
import { useNavigate, Link } from "react-router-dom";
import {
  Trophy, Shield, CreditCard, Search, LogOut,
  Swords, X, Receipt, Gamepad2, Clock, CheckCircle
} from "lucide-react";

const statusConfig = {
  open:         { label: "Open",         dot: "bg-emerald-400", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" },
  registration: { label: "Registration", dot: "bg-cyan-400",    text: "text-cyan-400",    border: "border-cyan-500/30",    bg: "bg-cyan-500/10"    },
  ongoing:      { label: "Ongoing",      dot: "bg-violet-400",  text: "text-violet-400",  border: "border-violet-500/30",  bg: "bg-violet-500/10"  },
  finished:     { label: "Selesai",      dot: "bg-gray-400",    text: "text-gray-400",    border: "border-gray-500/30",    bg: "bg-gray-500/10"    },
};

const teamStatusConfig = {
  pending:  { label: "Menunggu", text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30"  },
  approved: { label: "Diterima", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  rejected: { label: "Ditolak",  text: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/30"   },
};

const EMPTY_TEAM_FORM = { name: "", tournament_id: "", members: "" };
const EMPTY_PAY_FORM  = { team_id: "", tournament_id: "", amount: "", payment_method: "qris" };

export default function UserDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]       = useState("home");
  const [bracketFilter, setBracketFilter] = useState("ongoing");
  const [search, setSearch]             = useState("");
  const [tournaments, setTournaments]   = useState([]);
  const [myTeams, setMyTeams]           = useState([]);
  const [payments, setPayments]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showPayModal, setShowPayModal]   = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [teamForm, setTeamForm]         = useState(EMPTY_TEAM_FORM);
  const [payForm, setPayForm]           = useState(EMPTY_PAY_FORM);
  const [saving, setSaving]             = useState(false);
  const [notif, setNotif]               = useState("");
  const [currentUser, setCurrentUser]   = useState(null);
  const [proofFile, setProofFile]       = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [detailTeam, setDetailTeam]     = useState(null);

  useEffect(() => {
    api.get("/me")
      .then(res => {
        const userData = res.data?.user || res.data?.data || res.data;
        setCurrentUser(userData);
      })
      .catch(() => {
        setCurrentUser({ id: "1", name: "Peserta Ganteng", role: "peserta" });
      });
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tRes, tmRes, pRes] = await Promise.all([
        api.get("/tournaments"),
        api.get("/teams"),
        api.get("/payments"),
      ]);
      setTournaments(Array.isArray(tRes.data) ? tRes.data : tRes.data.data ?? []);
      setMyTeams(Array.isArray(tmRes.data) ? tmRes.data : tmRes.data.data ?? []);
      setPayments(Array.isArray(pRes.data) ? pRes.data : pRes.data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(""), 4000);
  };

  const handleDaftar = (t) => {
    setSelectedTournament(t);
    const targetId = t.id || t._id || t.id_tournament || (t.$oid ? t.$oid : "");
    setTeamForm({ ...EMPTY_TEAM_FORM, tournament_id: targetId });
    setShowTeamModal(true);
  };

  const getMemberCount = () =>
    teamForm.members
      ? teamForm.members.split(",").map(m => m.trim()).filter(Boolean).length
      : 0;

  const handleSaveTeam = async () => {
    if (!teamForm.name.trim()) return showNotif("❌ Nama tim kosong!");
    if (!teamForm.tournament_id) return showNotif("❌ Turnamen belum dipilih!");

    if (selectedTournament?.min_members) {
      const count = getMemberCount();
      const min   = Number(selectedTournament.min_members);
      if (count < min) {
        return showNotif(`❌ ${selectedTournament.game} butuh minimal ${min} anggota. Baru ${count} orang.`);
      }
    }

    let rawCaptainId = currentUser?.id || currentUser?.user?.id || currentUser?.data?.id || currentUser?._id || "1";

    setSaving(true);
    try {
      const cleanMembersArray = teamForm.members
        ? teamForm.members.split(",").map(m => m.trim()).filter(Boolean)
        : [];

      await api.post("/teams", {
        name:          teamForm.name.trim(),
        tournament_id: String(teamForm.tournament_id),
        captain_id:    String(rawCaptainId),
        members:       cleanMembersArray,
      }, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      });

      fetchAll();
      setShowTeamModal(false);
      setSelectedTournament(null);
      setTeamForm(EMPTY_TEAM_FORM);
      showNotif("✅ Tim berhasil didaftarkan!");
    } catch (err) {
      console.error(err);
      showNotif(`❌ ${err.response?.data?.message || "Gagal mendaftarkan tim."}`);
    } finally {
      setSaving(false);
    }
  };

  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const handlePayment = async () => {
    if (!proofFile) return showNotif("❌ Upload bukti transfer dulu!");
    setSaving(true);
    try {
      const formData = new FormData();
      const relatedTournament = tournaments.find(
        tr => (tr.id || tr._id) === payForm.tournament_id
      );
      formData.append("team_id",        payForm.team_id);
      formData.append("tournament_id",  payForm.tournament_id);
      formData.append("amount",         relatedTournament?.registration_fee ?? 0);
      formData.append("payment_method", "qris");
      formData.append("proof",          proofFile);

      await api.post("/payments", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      fetchAll();
      setShowPayModal(false);
      setProofFile(null);
      setProofPreview(null);
      showNotif("✅ Konfirmasi pembayaran terkirim! Menunggu verifikasi admin.");
    } catch (err) {
      console.error(err);
      showNotif("❌ Gagal mengirim konfirmasi.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try { await api.post("/logout"); } catch {}
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  const filteredTournaments = tournaments.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.game?.toLowerCase().includes(search.toLowerCase())
  );

  // Filter turnamen untuk tab bracket
  const bracketTournaments = tournaments.filter(t => {
    if (bracketFilter === "ongoing")  return t.status === "ongoing";
    if (bracketFilter === "finished") return t.status === "finished";
    if (bracketFilter === "upcoming") return t.status === "open" || t.status === "registration";
    return true;
  });

  const memberCount = getMemberCount();
  const minMembers  = Number(selectedTournament?.min_members ?? 0);

  const BRACKET_FILTERS = [
    { id: "ongoing",  label: "Berlangsung", icon: "🔴", color: "text-violet-400", activeBg: "bg-violet-500/20 border-violet-500/30" },
    { id: "upcoming", label: "Akan Datang", icon: "🕐", color: "text-cyan-400",   activeBg: "bg-cyan-500/20 border-cyan-500/30"     },
    { id: "finished", label: "Selesai",     icon: "✅", color: "text-gray-400",   activeBg: "bg-gray-500/20 border-gray-500/30"     },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-[#0d0d0f]/95 backdrop-blur border-b border-white/5">
        <div className="h-14 flex items-center gap-3 px-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <Swords size={14} className="text-[#0d0d0f]" />
            </div>
            <span className="text-white font-black tracking-wider text-sm">E<span className="text-emerald-400">-</span>TOURNEY</span>
          </div>
          <div className="flex-1 relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari turnamen..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
              {String(currentUser?.name ?? "P").slice(0,2).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="p-1.5 text-gray-600 hover:text-rose-400"><LogOut size={15} /></button>
          </div>
        </div>
      </header>

      {notif && <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl bg-neutral-900 border border-white/10 text-sm whitespace-nowrap">{notif}</div>}

      <main className="pt-16 pb-24 max-w-2xl mx-auto px-4">

        {/* TAB 1: BERANDA */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                <Trophy size={18} className="text-emerald-400 mx-auto mb-1" />
                <p className="text-2xl font-black text-emerald-400">{tournaments.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Turnamen</p>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-center">
                <Shield size={18} className="text-cyan-400 mx-auto mb-1" />
                <p className="text-2xl font-black text-cyan-400">{myTeams.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Tim Saya</p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3 text-center">
                <Receipt size={18} className="text-violet-400 mx-auto mb-1" />
                <p className="text-2xl font-black text-violet-400">{payments.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Transaksi</p>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTournaments.map(t => {
                // Definisi kondisi slot penuh dan status pendaftaran terbuka
                const isFull = (t.slots_used ?? 0) >= (t.max_teams ?? 0);
                const canRegister = (t.status === "open" || t.status === "registration") && !isFull;

                return (
                  <div key={t.id || t._id} className="bg-[#111113] border border-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white">{t.name}</h4>
                        <p className="text-xs text-gray-500">{t.game} · Rp {Number(t.registration_fee || 0).toLocaleString("id-ID")}</p>
                      </div>
                      
                      {/* Menggunakan skema logika tombol baru */}
                      {canRegister ? (
                        <button
                          onClick={() => handleDaftar(t)}
                          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                        >
                          Daftar
                        </button>
                      ) : t.status === "finished" ? (
                        <span className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-500/10 text-gray-600 border border-gray-500/20">
                          Selesai
                        </span>
                      ) : isFull ? (
                        <span className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Penuh
                        </span>
                      ) : (
                        <span className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 text-gray-600 border border-white/5">
                          Tutup
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                        👥 {t.slots_used ?? 0}/{t.max_teams} slot
                      </span>
                      {t.min_members && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          Min. {t.min_members} anggota/tim
                        </span>
                      )}
                      {t.status === "ongoing" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 animate-pulse">
                          🔴 Berlangsung
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredTournaments.length === 0 && (
                <p className="text-center text-xs text-gray-600 py-10">Tidak ada turnamen ditemukan.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TIM SAYA */}
        {activeTab === "teams" && (
          <div className="space-y-2 pt-3">
            {myTeams.map(t => {
              const sc = teamStatusConfig[t.status] ?? teamStatusConfig.pending;
              const tournament = tournaments.find(tr => (tr.id || tr._id) === t.tournament_id);
              return (
                <div key={t.id || t._id} className="bg-[#111113] border border-white/5 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-sm truncate">{t.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {tournament?.name ?? `ID: ${t.tournament_id}`}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[11px] font-semibold border shrink-0 ml-2 ${sc.bg} ${sc.text} ${sc.border}`}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Anggota preview */}
                  {t.members?.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-2">
                      {t.members.slice(0, 3).map((m, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">{m}</span>
                      ))}
                      {t.members.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">+{t.members.length - 3} lagi</span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetailTeam(t)}
                      className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold bg-white/5 text-gray-400 border border-white/10 hover:text-white"
                    >
                      Lihat Detail
                    </button>
                    {t.status === "approved" && (
                      <button onClick={() => {
                        setPayForm({ ...EMPTY_PAY_FORM, team_id: t.id || t._id, tournament_id: t.tournament_id });
                        setProofFile(null); setProofPreview(null); setShowPayModal(true);
                      }} className="flex-1 py-1.5 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-[11px] font-bold">
                        Bayar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {myTeams.length === 0 && (
              <p className="text-center text-xs text-gray-600 py-10">Belum ada tim yang terdaftar.</p>
            )}
          </div>
        )}

        {/* TAB 3: BRACKET */}
        {activeTab === "bracket" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white mb-1">Bagan Turnamen</h2>
              <p className="text-xs text-gray-500">Lihat bracket turnamen yang sedang berjalan, selesai, atau akan datang.</p>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              {BRACKET_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setBracketFilter(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    bracketFilter === f.id
                      ? f.activeBg + " text-white"
                      : "bg-transparent border-white/10 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span>{f.icon}</span>
                  {f.label}
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px]">
                    {tournaments.filter(t => {
                      if (f.id === "ongoing")  return t.status === "ongoing";
                      if (f.id === "finished") return t.status === "finished";
                      if (f.id === "upcoming") return t.status === "open" || t.status === "registration";
                      return false;
                    }).length}
                  </span>
                </button>
              ))}
            </div>

            {/* List turnamen */}
            <div className="space-y-3">
              {bracketTournaments.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3">
                    {bracketFilter === "ongoing" ? "🎮" : bracketFilter === "finished" ? "🏆" : "📅"}
                  </div>
                  <p className="text-xs text-gray-600">
                    {bracketFilter === "ongoing"  ? "Belum ada turnamen yang sedang berlangsung"  :
                     bracketFilter === "finished" ? "Belum ada turnamen yang selesai"             :
                     "Belum ada turnamen yang akan datang"}
                  </p>
                </div>
              ) : (
                bracketTournaments.map(t => (
                  <div key={t.id || t._id} className="bg-[#111113] border border-white/5 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white">{t.name}</h4>
                          {t.status === "ongoing" && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{t.game} · {t.start_date}</p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        t.status === "ongoing"  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20" :
                        t.status === "finished" ? "bg-gray-500/10 text-gray-400 border border-gray-500/20"       :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {t.status === "ongoing" ? "Berlangsung" : t.status === "finished" ? "Selesai" : "Akan Datang"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                          👥 {t.slots_used ?? 0}/{t.max_teams} tim
                        </span>
                        {t.prize && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            🏆 Rp {Number(t.prize || 0).toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>

                      {(t.status === "ongoing" || t.status === "finished") ? (
                        <Link
                          to={`/tournaments/${t._id || t.id}/bracket`}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
                        >
                          Lihat Bracket →
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-600">Bracket belum tersedia</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TRANSAKSI */}
        {activeTab === "payments" && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-400 mb-2">Riwayat Transaksi Kamu</h3>
            {payments.map(p => (
              <div key={p.id || p._id} className="bg-[#111113] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-400">ID Tim: {p.team_id}</p>
                  <p className="text-sm font-bold text-white mt-1">Rp {Number(p.amount || 10000).toLocaleString("id-ID")}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  p.status === 'paid'     ? 'bg-emerald-500/10 text-emerald-400' :
                  p.status === 'rejected' ? 'bg-rose-500/10 text-rose-400'       :
                  'bg-amber-500/10 text-amber-400'
                }`}>
                  {p.status || 'pending'}
                </span>
              </div>
            ))}
            {payments.length === 0 && (
              <p className="text-center text-xs text-gray-600 py-10">Belum ada riwayat transaksi.</p>
            )}
          </div>
        )}
      </main>

      {/* Modal Daftar Tim */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-md p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white">Daftarkan Tim</h2>
                {selectedTournament && (
                  <p className="text-xs text-emerald-400 mt-0.5">Turnamen: {selectedTournament.name}</p>
                )}
              </div>
              <button onClick={() => { setShowTeamModal(false); setSelectedTournament(null); }} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {minMembers > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-lg">🎮</span>
                <p className="text-xs text-cyan-400">
                  <span className="font-bold">{selectedTournament?.game}</span> membutuhkan minimal{" "}
                  <span className="font-bold">{minMembers} anggota</span> per tim
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-1">Nama Tim</label>
              <input
                value={teamForm.name}
                onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                placeholder="Masukkan nama tim kamu"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-400">
                  Anggota Tim
                  {minMembers > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Min. {minMembers} orang
                    </span>
                  )}
                </label>
                {minMembers > 0 && (
                  <span className={`text-xs font-bold ${memberCount >= minMembers ? "text-emerald-400" : "text-amber-400"}`}>
                    {memberCount}/{minMembers}
                  </span>
                )}
              </div>
              <textarea
                value={teamForm.members}
                onChange={e => setTeamForm({ ...teamForm, members: e.target.value })}
                placeholder={
                  minMembers > 0
                    ? `Masukkan minimal ${minMembers} nama anggota, pisahkan dengan koma`
                    : "Nama anggota, pisahkan dengan koma (contoh: Budi, Andi, Caca)"
                }
                className={`w-full bg-white/5 border rounded-lg p-2 text-sm text-white resize-none focus:outline-none transition-colors ${
                  minMembers > 0 && memberCount > 0
                    ? memberCount >= minMembers
                      ? "border-emerald-500/50 focus:border-emerald-500"
                      : "border-amber-500/50 focus:border-amber-500"
                    : "border-white/10 focus:border-cyan-500"
                }`}
                rows={3}
              />
              {minMembers > 0 && memberCount > 0 && (
                <p className="text-xs mt-1">
                  {memberCount >= minMembers
                    ? <span className="text-emerald-400">✅ {memberCount} anggota — cukup!</span>
                    : <span className="text-amber-400">⚠️ Kurang {minMembers - memberCount} orang lagi</span>
                  }
                </p>
              )}
            </div>

            <button
              onClick={handleSaveTeam}
              disabled={saving || (minMembers > 0 && memberCount < minMembers)}
              className="w-full py-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-sm font-bold hover:bg-cyan-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? "Menyimpan..." : "Simpan & Daftar"}
            </button>
          </div>
        </div>
      )}

      {/* Modal Detail Tim */}
      {detailTeam && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-white">Detail Tim</h2>
              <button onClick={() => setDetailTeam(null)} className="text-gray-500 hover:text-white p-1"><X size={16} /></button>
            </div>

            {/* Status */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${teamStatusConfig[detailTeam.status]?.bg ?? "bg-white/5"} border ${teamStatusConfig[detailTeam.status]?.border ?? "border-white/10"}`}>
              <span className={`text-xs font-bold ${teamStatusConfig[detailTeam.status]?.text ?? "text-gray-400"}`}>
                Status: {teamStatusConfig[detailTeam.status]?.label ?? detailTeam.status}
              </span>
            </div>

            {/* Info */}
            {[
              { label: "Nama Tim", value: detailTeam.name },
              { label: "Turnamen", value: tournaments.find(tr => (tr.id || tr._id) === detailTeam.tournament_id)?.name ?? detailTeam.tournament_id },
              { label: "Didaftarkan", value: detailTeam.registered_at ? new Date(detailTeam.registered_at).toLocaleDateString("id-ID") : "-" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs text-white font-medium text-right max-w-[200px] truncate">{value}</span>
              </div>
            ))}

            {/* Anggota */}
            <div>
              <p className="text-xs text-gray-500 mb-2">Anggota Tim ({detailTeam.members?.length ?? 0} orang)</p>
              <div className="space-y-1.5">
                {detailTeam.members?.length > 0 ? detailTeam.members.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                    <span className="text-xs text-white">{m}</span>
                  </div>
                )) : (
                  <p className="text-xs text-gray-600">Belum ada anggota.</p>
                )}
              </div>
            </div>

            <button onClick={() => setDetailTeam(null)}
              className="w-full py-2 rounded-lg bg-white/5 text-gray-400 text-xs font-semibold border border-white/10">
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal Pembayaran */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111113] border border-white/10 rounded-2xl w-full max-w-sm p-5 text-center space-y-4">
            <div className="flex justify-between items-center text-left">
              <h2 className="text-base font-bold text-white">Pembayaran Turnamen</h2>
              <button onClick={() => { setShowPayModal(false); setProofFile(null); setProofPreview(null); }} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-400">Silakan scan kode QRIS di bawah ini menggunakan aplikasi e-wallet kamu untuk menyelesaikan pembayaran pendaftaran.</p>
            <div className="bg-white p-3 rounded-xl inline-block mx-auto border-4 border-violet-500/20">
              <img src="/images/qris.jpeg" alt="QRIS Pembayaran" className="w-48 h-48 object-contain mx-auto" onError={(e) => {
                e.target.src = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ETOURNEY-QRIS-PAYMENT";
              }} />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-lg p-3 text-left">
              <label className="block text-[10px] text-gray-500">Metode Pembayaran</label>
              <p className="text-xs font-bold text-violet-400 uppercase mt-0.5">QRIS / ALL E-WALLET</p>
            </div>
            <div className="text-left space-y-2">
              <label className="block text-xs text-gray-400">Upload Bukti Transfer <span className="text-rose-400">*</span></label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors bg-white/5">
                {proofPreview ? (
                  <img src={proofPreview} alt="Preview" className="h-full w-full object-contain rounded-xl p-1" />
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Klik untuk upload foto bukti transfer</p>
                    <p className="text-[10px] text-gray-600 mt-1">JPG, JPEG, PNG — max 5MB</p>
                  </div>
                )}
                <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={handleProofChange} className="hidden" />
              </label>
              {proofFile && <p className="text-xs text-emerald-400">✅ {proofFile.name}</p>}
            </div>
            <button
              onClick={handlePayment}
              disabled={saving || !proofFile}
              className="w-full py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-bold hover:bg-emerald-500/30 transition-colors disabled:opacity-40"
            >
              {saving ? "Mengirim..." : "Saya Sudah Transfer"}
            </button>
          </div>
        </div>
      )}

      {/* Tabs Menu Bawah — 4 tab */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0d0d0f]/95 backdrop-blur border-t border-white/5 flex">
        {[
          { id: "home",     label: "Beranda",   icon: Gamepad2  },
          { id: "teams",    label: "Tim Saya",  icon: Shield    },
          { id: "bracket",  label: "Bracket",   icon: Swords    },
          { id: "payments", label: "Transaksi", icon: CreditCard },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative ${activeTab === id ? "text-emerald-400" : "text-gray-600"}`}>
            <Icon size={20} />
            <span className="text-[10px]">{label}</span>
            {/* Dot notif untuk bracket ongoing */}
            {id === "bracket" && tournaments.filter(t => t.status === "ongoing").length > 0 && (
              <span className="absolute top-2 right-[calc(50%-12px)] w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}