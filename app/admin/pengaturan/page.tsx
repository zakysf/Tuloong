"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/services/admin.service";
import type { PlatformSettings } from "@/types/admin";
import { Settings, Loader2, Save } from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";

export default function AdminPengaturanPage() {
  const [settings, setSettings] = useState<PlatformSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: "success" | "error", text: string} | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateSettings(settings);
      setMessage({ type: "success", text: "Pengaturan berhasil disimpan." });
    } catch (error) {
      setMessage({ type: "error", text: "Gagal menyimpan pengaturan." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Memuat pengaturan...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="text-gray-400" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan Platform</h1>
          <p className="text-gray-500 mt-1">Konfigurasi variabel global sistem.</p>
        </div>
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
          <div className="space-y-4 border-b border-gray-100 pb-6">
            <h3 className="font-bold text-gray-900 mb-4">Integrasi Pembayaran</h3>
            
            <FormInput
              label="Midtrans Client Key (Frontend)"
              value={settings['midtrans_client_key'] || ""}
              onChange={(e) => handleChange('midtrans_client_key', e.target.value)}
              placeholder="SB-Mid-client-..."
            />
            
            <FormInput
              label="Batas Waktu Pembayaran (Menit)"
              type="number"
              value={settings['payment_expiry_minutes'] || "60"}
              onChange={(e) => handleChange('payment_expiry_minutes', e.target.value)}
            />
          </div>

          <div className="space-y-4 border-b border-gray-100 pb-6">
            <h3 className="font-bold text-gray-900 mb-4">Pengaturan Sistem</h3>
            
            <FormInput
              label="Potongan Platform (%)"
              type="number"
              value={settings['platform_fee_percent'] || "0"}
              onChange={(e) => handleChange('platform_fee_percent', e.target.value)}
              placeholder="Contoh: 0"
            />
            <p className="text-xs text-gray-500 mt-1">Tuloong secara default gratis (0%).</p>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="bg-teal-700 hover:bg-teal-800 text-white min-w-[150px] h-11"
            >
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
              Simpan Pengaturan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
