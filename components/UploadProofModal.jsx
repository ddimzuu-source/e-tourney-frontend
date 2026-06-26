import { useState } from "react";
import api from "./api";
import { X, UploadCloud, Loader2, FileImage, CheckCircle2 } from "lucide-react";

export default function UploadProofModal({ paymentId, onClose, onUploadSuccess }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle perubahan input file
  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (PNG, JPG, JPEG)!");
      return;
    }

    // Validasi ukuran file (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran gambar terlalu besar! Maksimal 2MB.");
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Handle proses upload file ke backend
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Silakan pilih gambar terlebih dahulu!");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("payment_id", paymentId);
      formData.append("proof_image", image);

      // Kirim data ke API Laravel
      const res = await api.post("/payments/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onUploadSuccess) onUploadSuccess(res.data.url);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Gagal mengunggah bukti pembayaran.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-[#0a1a14] border border-[#1a3d30] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0d1f1a]">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <UploadCloud size={18} className="text-emerald-500" /> Upload Bukti Transfer
          </h2>
          <button 
            onClick={onClose} 
            disabled={uploading}
            className="p-1.5 text-emerald-500/50 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-30"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleUpload} className="p-6 space-y-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <CheckCircle2 size={48} className="text-emerald-400 animate-bounce" />
              <p className="text-sm font-semibold text-white">Bukti Transfer Berhasil Diunggah!</p>
              <p className="text-xs text-emerald-500/60">Menutup jendela...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs font-medium text-rose-400 text-center">
                  {error}
                </div>
              )}

              {/* Area Dropzone / Input File */}
              <div className="relative">
                <input 
                  type="file" 
                  id="proof-file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />
                
                <label 
                  htmlFor="proof-file"
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    previewUrl 
                      ? "border-emerald-500/50 bg-[#0d1f1a]/30" 
                      : "border-[#1a3d30] bg-[#0d1f1a]/10 hover:border-emerald-500/30 hover:bg-[#0d1f1a]/20"
                  }`}
                >
                  {previewUrl ? (
                    <div className="space-y-2 w-full">
                      <img 
                        src={previewUrl} 
                        alt="Preview Bukti" 
                        className="max-h-40 mx-auto rounded-lg object-contain border border-[#1a3d30]" 
                      />
                      <p className="text-[11px] text-emerald-400 font-medium truncate px-4">
                        {image?.name}
                      </p>
                      <span className="text-[10px] text-emerald-500/40 block">Klik untuk mengganti gambar</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-emerald-500/40">
                      <FileImage size={32} className="stroke-[1.5]" />
                      <span className="text-xs font-semibold text-emerald-200">Pilih Foto Bukti Transfer</span>
                      <span className="text-[10px]">Format: PNG, JPG, JPEG (Maks. 2MB)</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={uploading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#0d1f1a] border border-[#1a3d30] text-emerald-400 text-xs font-semibold hover:bg-[#1a3d30] transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading || !image}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/20 text-white text-xs font-bold shadow-lg shadow-emerald-500/10 transition-all disabled:text-emerald-500/40 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    "Kirim Bukti"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}