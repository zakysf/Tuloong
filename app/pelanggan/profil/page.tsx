"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { updateProfile } from "@/lib/services/profile.service";
import FormInput from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";
import { Loader2, UserCircle } from "lucide-react";

export default function PelangganProfilPage() {
  const { user, refreshUser } = useAuth();
  
  const [nama, setNama] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [fotoProfilUrl, setFotoProfilUrl] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  useEffect(() => {
    if (user) {
      setNama(user.nama);
      setNomorTelepon(user.nomor_telepon || "");
      setFotoProfilUrl(user.foto_profil || "");
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFile(e.target.files[0]);
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoProfilUrl(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload: any = {
      nama,
      nomor_telepon: nomorTelepon,
    };
    if (fotoFile) {
      payload.foto_profil = fotoFile;
    }

    try {
      await updateProfile(payload);
      await refreshUser(); // Update auth context
      setMessage({ type: "success", text: "Profil berhasil diperbarui." });
    } catch (error: any) {
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal memperbarui profil." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-500 mt-1">Perbarui informasi akun Anda.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        
        {message && (
          <div className={`mb-6 p-4 rounded-xl border font-medium text-sm ${
            message.type === "success" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden mb-3 group">
              {fotoProfilUrl ? (
                <img src={fotoProfilUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-full h-full text-gray-400 p-2" />
              )}
              <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-medium cursor-pointer transition-opacity">
                Ubah
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
            <p className="text-xs text-gray-500">Klik gambar untuk mengubah foto</p>
          </div>

          <FormInput
            label="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
            <input 
              type="email" 
              value={user?.email || ""} 
              disabled 
              className="w-full h-11 px-3 border rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed" 
            />
            <p className="text-xs text-gray-400 mt-1">Email tidak dapat diubah.</p>
          </div>

          <FormInput
            label="Nomor Telepon"
            value={nomorTelepon}
            onChange={(e) => setNomorTelepon(e.target.value)}
            placeholder="Contoh: 08123456789"
          />

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-teal-700 hover:bg-teal-800 text-white min-w-[150px] h-11"
            >
              {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : "Simpan Profil"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
