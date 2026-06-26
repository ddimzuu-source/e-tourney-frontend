import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
    Trophy, BookOpen, Info, LogIn, Swords, 
    Gamepad2, Users, UserCheck, Flame, Wallet, BarChart3, 
    Menu, X, MessageCircle 
} from "lucide-react";

// ── WhatsApp FAB (UI Claude) ────────────────────────────────────────────────
function WhatsAppFAB() {
    const phone = "6282123052736";
    const message = encodeURIComponent("Halo E-Tourney, saya ingin bertanya tentang turnamen");
    const waUrl = `https://wa.me/${phone}?text=${message}`;

    return (
        <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-200 active:scale-95"
            title="Chat via WhatsApp"
        >
            <MessageCircle size={28} />
        </a>
    );
}

// ── Navbar (UI Claude) ───────────────────────────────────────────────────────
function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-[#0a1a14]/90 backdrop-blur-md border-b border-white/10 py-3' : 'bg-[#0a1a14] border-b border-white/5 py-4'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                        <Swords size={18} />
                    </div>
                    <span className="text-base font-bold text-white tracking-wider">E-TOURNEY</span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#turnamen" className="flex items-center gap-2 text-sm text-emerald-300/70 hover:text-white transition-colors">
                        <Trophy size={14} /> Turnamen
                    </a>
                    <a href="#fitur" className="flex items-center gap-2 text-sm text-emerald-300/70 hover:text-white transition-colors">
                        <BookOpen size={14} /> Cara daftar
                    </a>
                    <a href="#fitur" className="flex items-center gap-2 text-sm text-emerald-300/70 hover:text-white transition-colors">
                        <Info size={14} /> Tentang
                    </a>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login" className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-white/10 text-emerald-100 hover:bg-white/5 transition-colors">
                        <LogIn size={14} /> Masuk
                    </Link>
                    <Link to="/register" className="text-sm px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5">
                        Daftar gratis
                    </Link>
                </div>

                <button className="md:hidden text-emerald-300 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a1a14] border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl">
                    <a href="#turnamen" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-emerald-300/80 hover:text-white p-2 rounded-lg hover:bg-white/5">
                        <Trophy size={18} /> Turnamen
                    </a>
                    <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-emerald-300/80 hover:text-white p-2 rounded-lg hover:bg-white/5">
                        <BookOpen size={18} /> Cara daftar
                    </a>
                    <div className="h-px w-full bg-white/10 my-2"></div>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex justify-center items-center gap-2 text-sm p-3 rounded-lg border border-white/10 text-emerald-100 hover:bg-white/5">
                        <LogIn size={16} /> Masuk
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex justify-center items-center text-sm p-3 rounded-lg bg-emerald-500 text-white font-semibold">
                        Daftar gratis
                    </Link>
                </div>
            )}
        </nav>
    );
}

// ── Hero Section (UI Claude) ─────────────────────────────────────────────────
function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-6 text-center bg-[#0d1f1a] overflow-hidden border-b border-[#1a3d30]">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                 <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(26,158,117,0.1)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 text-xs py-1.5 px-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Platform turnamen game online
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 text-white tracking-tight">
                    Atur dan ikuti turnamen <br className="hidden md:block"/>
                    <span className="text-emerald-500 inline-block drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">game online</span> dengan mudah
                </h1>

                <p className="text-base md:text-lg text-emerald-100/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                    E-Tourney memudahkan penyelenggara membuat bracket, mengelola tim, dan memantau hasil turnamen secara real-time.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#turnamen" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-transform active:scale-95">
                        Lihat turnamen →
                    </a>
                    <a href="#fitur" className="w-full sm:w-auto px-8 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-emerald-100 font-semibold transition-colors">
                        Pelajari sistem
                    </a>
                </div>
            </div>
        </section>
    );
}

// ── Stats Bar (UI Claude) ────────────────────────────────────────────────────
const STATS = [
    { num: "120+", label: "Turnamen digelar", icon: Gamepad2 },
    { num: "850+", label: "Tim terdaftar", icon: Users },
    { num: "3.200+", label: "Pemain aktif", icon: UserCheck },
    { num: "15+", label: "Jenis game", icon: Flame },
];

function StatsBar() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#1a3d30] bg-[#0a1a14]">
            {STATS.map((s, i) => (
                <div key={i} className={`p-6 text-center flex flex-col items-center justify-center ${i % 2 !== 0 ? '' : 'border-r border-[#1a3d30]'} md:border-r border-[#1a3d30] last:border-r-0 hover:bg-white/[0.02] transition-colors`}>
                    <s.icon size={24} className="text-emerald-500 mb-3 opacity-80" />
                    <div className="text-2xl md:text-3xl font-black text-emerald-500 mb-1">{s.num}</div>
                    <div className="text-xs md:text-sm font-medium text-emerald-200/60 uppercase tracking-wider">{s.label}</div>
                </div>
            ))}
        </div>
    );
}

// ── Features (UI Claude) ─────────────────────────────────────────────────────
const FEATURES = [
    { icon: Trophy, title: "Bracket otomatis", desc: "Generate bracket single/double elimination secara otomatis begitu pendaftaran ditutup." },
    { icon: Users, title: "Manajemen tim", desc: "Daftarkan tim, kelola roster pemain, dan pantau performa di setiap pertandingan." },
    { icon: Wallet, title: "Pembayaran terintegrasi", desc: "Kelola biaya pendaftaran via QRIS dan distribusi hadiah langsung dari dashboard." },
    { icon: BarChart3, title: "Statistik real-time", desc: "Pantau pendaftaran, hasil match, dan riwayat kemenangan langsung dari database." },
];

function Features() {
    return (
        <section id="fitur" className="py-20 px-6 bg-[#0d1f1a]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-3">Semua yang kamu butuhkan</h2>
                    <p className="text-emerald-200/60 text-lg">Fitur lengkap untuk kelancaran turnamen E-Sports</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="bg-[#0a1a14] border border-[#1a3d30] rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-[#0f241d] transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                                <f.icon size={24} className="text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-sm text-emerald-100/60 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Tournaments Section (PASTI MUNCUL & ANTI KOSONG) ────────────────────────
function Tournaments() {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/tournaments") 
            .then((res) => {
                console.log("RESPONSE DATA API:", res.data);
                
                let dataAkhir = [];
                if (Array.isArray(res.data)) {
                    dataAkhir = res.data;
                } else if (res.data && Array.isArray(res.data.data)) {
                    dataAkhir = res.data.data;
                } else if (res.data && typeof res.data === 'object') {
                    dataAkhir = Object.values(res.data).filter(item => typeof item === 'object' && item !== null);
                }

                setTournaments(dataAkhir);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gagal fetch turnamen:", err);
                setError(true);
                setLoading(false);
            });
    }, []);

    const formatRupiah = (angka) => {
        if (!angka || angka === 0 || angka === "0") return "Gratis";
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    };

    const formatTanggal = (dateStr) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    };

    const getGameBadgeProps = (gameName) => {
        const name = gameName ? String(gameName).toUpperCase() : "GAME";
        if (name.includes("MLBB") || name.includes("MOBILE LEGENDS") || name.includes("MPL")) {
            return { text: "MLBB", style: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
        }
        if (name.includes("FREE FIRE") || name.includes("FF")) {
            return { text: "FFWS", style: "bg-red-500/10 text-red-400 border border-red-500/20" };
        }
        if (name.includes("FOOTBALL") || name.includes("PES")) {
            return { text: "E-FOOTBALL", style: "bg-orange-500/10 text-orange-400 border border-orange-500/20" };
        }
        return { text: name, style: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" };
    };

    return (
        <section id="turnamen" className="py-20 px-6 bg-[#0a1a14] border-t border-[#1a3d30]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Turnamen Terbaru</h2>
                        <p className="text-emerald-200/60">Daftarkan timmu sekarang sebelum slot penuh!</p>
                    </div>
                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm flex items-center gap-1 group">
                        Lihat Semua <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {loading && <p className="text-center text-emerald-300/50 text-sm py-10 animate-pulse">Menghubungkan ke MongoDB Atlas...</p>}
                {error && <p className="text-center text-rose-400 text-sm py-10">Gagal memuat data turnamen aktif.</p>}
                {!loading && !error && tournaments.length === 0 && (
                    <p className="text-center text-emerald-200/40 text-sm py-10">Belum ada turnamen aktif di database.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && !error && tournaments.map((t, i) => {
                        // ── EMERGENCY JUMPER ENGINE ──
                        const semuaKeys = Object.keys(t);
                        const dataStringNama = semuaKeys.find(k => typeof t[k] === 'string' && t[k].length > 4 && k !== '_id' && !k.includes('date') && !k.includes('status'));
                        const dataAngkaBiaya = semuaKeys.find(k => typeof t[k] === 'number' || (!isNaN(t[k]) && k.includes('fee' || 'biaya' || 'price')));

                        const namaTurnamen = t.name || t.nama || t.title || t.nama_turnamen || (dataStringNama ? t[dataStringNama] : `Tournament #${i + 1}`);
                        const biayaDaftar = t.registration_fee || t.biaya || t.biaya_daftar || t.fee || t.price || (dataAngkaBiaya ? t[dataAngkaBiaya] : 0);
                        const gameName = t.game || t.game_name || t.nama_game || t.jenis_game || "MLBB";
                        const tanggalMulai = t.start_date || t.tanggal || t.date || t.tanggal_mulai || "2026-06-15";

                        const totalSlots = parseInt(t.max_teams ?? t.max_slots ?? t.maxSlots ?? t.slots_max ?? t.kuota ?? 16);
                        const filledSlots = parseInt(t.slots_used ?? t.teams_count ?? t.registered_teams ?? t.slots_filled ?? t.slots ?? (t.teams ? t.teams.length : 0) ?? 0);
                        
                        const currentStatus = String(t.status || "Open").toUpperCase();
                        const isFinished = currentStatus === "FINISHED" || currentStatus === "DONE" || currentStatus === "SELESAI";
                        const isFull = filledSlots >= totalSlots || currentStatus === "ONGOING" || currentStatus === "BERJALAN";
                        const badgeProps = getGameBadgeProps(gameName);

                        return (
                            <div key={t._id || t.id || i} className="bg-[#0d1f1a] border border-[#1a3d30] rounded-2xl p-6 flex flex-col hover:border-emerald-500/40 transition-colors">
                                {/* Header Card (Badges) */}
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 uppercase rounded-md ${badgeProps.style}`}>
                                        {badgeProps.text}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border tracking-wider uppercase ${
                                        isFinished
                                            ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' 
                                            : currentStatus === "ONGOING" || currentStatus === "BERJALAN"
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                : filledSlots >= totalSlots 
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    }`}>
                                        {isFinished ? "Finished" : (currentStatus === "ONGOING" || currentStatus === "BERJALAN") ? "Ongoing" : filledSlots >= totalSlots ? "Penuh" : "Open"}
                                    </span>
                                </div>
                                
                                {/* Info Turnamen */}
                                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{namaTurnamen}</h3>
                                <p className="text-sm text-emerald-100/50 mb-6">Biaya: {formatRupiah(biayaDaftar)}</p>
                                
                                {/* Status Meter */}
                                <div className="mt-auto space-y-3 bg-[#0a1a14] p-4 rounded-xl border border-white/5">
                                    <div className="flex justify-between items-center text-xs font-medium">
                                        <span className="text-emerald-100/50 flex items-center gap-1.5"><Users size={14}/> Slot Tim</span>
                                        <span className="text-white">{filledSlots} / {totalSlots}</span>
                                    </div>
                                    
                                    {/* Progress Bar Slot Tim */}
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${isFinished ? 'bg-zinc-500' : isFull ? 'bg-amber-500' : filledSlots >= totalSlots ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                                            style={{ width: `${totalSlots > 0 ? (filledSlots / totalSlots) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-xs font-medium pt-2">
                                        <span className="text-emerald-100/50">Mulai</span>
                                        <span className="text-white">{formatTanggal(tanggalMulai)}</span>
                                    </div>
                                </div>

                                {/* Tombol Pendaftaran */}
                                <Link 
                                    to={isFull || isFinished ? "#" : "/login"} 
                                    className={`w-full mt-5 py-2.5 rounded-xl text-sm font-bold text-center transition-all ${
                                        isFinished
                                            ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed pointer-events-none'
                                            : currentStatus === "ONGOING" || currentStatus === "BERJALAN"
                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 cursor-not-allowed pointer-events-none'
                                                : filledSlots >= totalSlots
                                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 cursor-not-allowed pointer-events-none' 
                                                    : 'bg-emerald-500 hover:bg-emerald-400 text-white active:scale-95'
                                    }`}
                                >
                                    {isFinished ? 'Turnamen Selesai' : (currentStatus === "ONGOING" || currentStatus === "BERJALAN") ? 'Sedang Berjalan' : filledSlots >= totalSlots ? 'Pendaftaran Tutup' : 'Daftar Sekarang'}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ── CTA (UI Claude) ───────────────────────────────────────────────────────────
function CTA() {
    return (
        <section className="py-20 px-6 text-center bg-[#0d1f1a] border-t border-[#1a3d30]">
            <div className="max-w-2xl mx-auto bg-gradient-to-b from-emerald-500/10 to-transparent p-10 rounded-3xl border border-emerald-500/20">
                <Trophy size={48} className="mx-auto text-emerald-400 mb-6" />
                <h2 className="text-3xl font-black text-white mb-4">Siap menjemput kemenanganmu?</h2>
                <p className="text-emerald-100/70 mb-8 max-w-md mx-auto">
                    Bergabunglah dengan ribuan pemain lainnya. Buat timmu, ikuti turnamen, dan buktikan siapa yang terbaik!
                </p>
                <Link to="/register" className="px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 inline-flex items-center gap-2">
                    Daftar Sekarang Gratis <UserCheck size={18} />
                </Link>
            </div>
        </section>
    );
}

// ── Footer (UI Claude) ────────────────────────────────────────────────────────
function Footer() {
    return (
        <footer className="py-8 px-6 text-center border-t border-[#1a3d30] bg-[#0a1a14]">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Swords size={20} className="text-emerald-500" />
                <span className="text-lg font-bold text-white tracking-wider">E-TOURNEY</span>
            </div>
            <p className="text-sm text-emerald-100/50">
                © {new Date().getFullYear()} E-Tourney. Platform manajemen turnamen game online profesional.
            </p>
        </footer>
    );
}

export default function HomePage() {
    useEffect(() => {
        document.title = "E-Tourney - Platform Turnamen Game Online";
    }, []);
    return (
        <div className="min-h-screen font-sans bg-[#0d1f1a] selection:bg-emerald-500/30">
            <Navbar />
            <Hero />
            <StatsBar />
            <Features />
            <Tournaments />
            <CTA />
            <Footer />
            <WhatsAppFAB />
        </div>
    );
}