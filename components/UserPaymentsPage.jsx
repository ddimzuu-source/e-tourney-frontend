import { useState, useEffect } from "react";
import api from "./api"; 
import { CreditCard, UploadCloud, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
// Import Modal yang sudah kita buat di Langkah 6 kemarin
import UploadProofModal from "./UploadProofModal"; 

export default function MemberPaymentsPage() {
  const [myPayments, setMyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk mengontrol penampilan modal upload bukti transfer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {
    document.title = "E-Tourney - Pembayaran Saya";
    fetchMyPayments();
  }, []);

  const fetchMyPayments = async () => {
    try {
      setLoading(true);
      // Mengambil data transaksi/pembayaran khusus tim milik user yang login
      const res = await api.get("/payments"); 
      setMyPayments(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat data pembayaran peserta:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi saat peserta klik tombol "Upload Bukti"
  const handleOpenUploadModal = (id) => {
    setSelectedPaymentId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0d1f1a] p-6 text-emerald-100 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Halaman */}
        <div className="flex items-center gap-2 border-b border-[#1a3d30] pb-4">
          <CreditCard className="text-emerald-500" size={24} />
          <h1 className="text-xl font-bold text-white uppercase tracking-wide">Status Pembayaran Tim</h1>
        </div>

        {/* Konten Utama */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="text-emerald-500 animate-spin" size={32} />
            <p className="text-sm text-emerald-500/50">Memuat data pembayaran kamu...</p>
          </div>
        ) : myPayments.length === 0 ? (
          <div className="text-center py-16 bg-[#0a1a14] rounded-xl border border-[#1a3d30] text-emerald-500/40 text-sm">
            Kamu belum memiliki riwayat pendaftaran turnamen atau tagihan pembayaran.
          </div>
        ) : (
          <div className="space-y-4">
            {myPayments.map((p) => {
              const pId = p.id || p._id;
              const status = (p.status || "pending").toLowerCase();

              return (
                <div key={pId} className="p-5 rounded-xl border border-[#1a3d30] bg-[#0a1a14] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-500/20 transition-all shadow-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded mb-1 inline-block">
                      {p.tournament?.game_type || "Tournament"}
                    </span>
                    <h3 className="text-md font-bold text-white">{p.tournament?.name || "Turnamen Tanpa Nama"}</h3>
                    <p className="text-xs text-emerald-100/50 mb-2">Nama Tim: <span className="text-emerald-400 font-medium">{p.team?.name || "-"}</span></p>
                    <p className="text-base font-mono text-emerald-400 font-bold">
                      Rp {(p.amount || 0).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex sm:flex-col md:flex-row items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Badge Status Pembayaran */}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${
                      status === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      status === "rejected" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                      "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {status === "paid" ? <CheckCircle size={12} /> : status === "rejected" ? <XCircle size={12} /> : <Clock size={12} />}
                      {p.status || "PENDING"}
                    </span>

                    {/* Tombol Upload Bukti: Hilang jika status sudah PAID */}
                    {status !== "paid" && (
                      <button
                        onClick={() => handleOpenUploadModal(pId)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs transition-colors shadow-lg shadow-emerald-500/10 active:scale-95"
                      >
                        <UploadCloud size={14} /> 
                        {p.proof_path ? "Ganti Bukti" : "Upload Bukti"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Render Modal Upload ketika state isModalOpen bernilai true */}
      {isModalOpen && (
        <UploadProofModal
          paymentId={selectedPaymentId}
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={() => {
            // Callback: jika upload sukses, panggil ulang data transaksi agar UI otomatis ter-refresh ke PENDING
            fetchMyPayments();
          }}
        />
      )}
    </div>
  );
}