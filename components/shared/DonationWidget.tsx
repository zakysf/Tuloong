"use client";

import { useState } from "react";
import { Heart, Coins, CheckCircle2, QrCode, CreditCard, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PRESET_AMOUNTS = [15000, 25000, 50000, 100000];

export default function DonationWidget() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("qris");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  const getFinalAmount = () => {
    if (selectedAmount !== null) return selectedAmount;
    const custom = parseInt(customAmount.replace(/[^0-9]/g, ""), 10);
    return isNaN(custom) ? 0 : custom;
  };

  const handlePresetSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    if (!rawValue) {
      setCustomAmount("");
      return;
    }
    const formatted = new Intl.NumberFormat("id-ID").format(parseInt(rawValue, 10));
    setCustomAmount(formatted);
    setSelectedAmount(null);
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (getFinalAmount() < 5000) {
      alert("Minimal donasi adalah Rp 5.000");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);
  };

  const handleReset = () => {
    setShowSuccessModal(false);
    setSelectedAmount(25000);
    setCustomAmount("");
    setName("");
    setMessage("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl soft-shadow-lg overflow-hidden border border-neutral-100/50">
      {/* Decorative Accent Top */}
      <div className="h-2 bg-gradient-to-r from-primary to-emerald-600" />

      <div className="p-8 md:p-10">
        <div className="text-center max-w-md mx-auto mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-primary mb-4 border border-amber-100">
            <Heart size={26} fill="currentColor" />
          </div>
          <h3
            className="text-2xl font-bold text-neutral-900"
            style={{ fontFamily: "var(--font-poppins, Poppins)" }}
          >
            Dukung Perusahaan Kami
          </h3>
          <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
            Donasimu membantu operasional Tuloong dalam memvalidasi KTP Mitra, menyaring penipuan, dan melatih pekerja informal demi Indonesia yang lebih sejahtera.
          </p>
        </div>

        <form onSubmit={handleDonate} className="space-y-6">
          {/* Preset Buttons */}
          <div>
            <Label className="text-sm font-semibold text-neutral-800 mb-3 block">
              Pilih Nominal Donasi
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_AMOUNTS.map((amount) => {
                const isSelected = selectedAmount === amount;
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handlePresetSelect(amount)}
                    className={`h-12 rounded-xl text-sm font-semibold transition-all duration-150 border cursor-pointer ${
                      isSelected
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    Rp {amount.toLocaleString("id-ID")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Input */}
          <div className="relative">
            <Label htmlFor="custom-amount" className="text-sm font-semibold text-neutral-800 mb-1.5 block">
              Atau masukkan nominal khusus (Min Rp 5.000)
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-sm">
                Rp
              </span>
              <Input
                id="custom-amount"
                type="text"
                placeholder="Contoh: 15.000"
                value={customAmount}
                onChange={handleCustomAmountChange}
                className="pl-11 h-12 rounded-xl border-neutral-200 text-neutral-800 placeholder:text-neutral-400 font-semibold focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary"
              />
            </div>
          </div>

          {/* Message & Name Inputs */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="donor-name" className="text-sm font-semibold text-neutral-800 mb-1.5 block">
                Nama Donatur <span className="text-neutral-400 font-normal">(Opsional)</span>
              </Label>
              <Input
                id="donor-name"
                placeholder="Contoh: Orang Baik / Hamba Allah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl border-neutral-200"
              />
            </div>
            <div>
              <Label htmlFor="donor-message" className="text-sm font-semibold text-neutral-800 mb-1.5 block">
                Pesan Dukungan <span className="text-neutral-400 font-normal">(Opsional)</span>
              </Label>
              <Input
                id="donor-message"
                placeholder="Semoga Tuloong semakin jaya!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-12 rounded-xl border-neutral-200"
              />
            </div>
          </div>

          {/* CTA Submit */}
          <Button
            type="submit"
            className="w-full h-13 rounded-2xl text-base font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95 text-white flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <Coins size={18} />
            Dukung Sekarang — Rp {getFinalAmount().toLocaleString("id-ID")}
          </Button>
        </form>
      </div>

      {/* Payment Selection Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md rounded-3xl p-6 border-neutral-100 shadow-xl bg-white">
          <DialogHeader className="text-center sm:text-left">
            <DialogTitle className="text-lg font-bold text-neutral-900" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
              Pilih Metode Dukungan
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-500">
              Pilih salah satu metode pembayaran simulasi di bawah untuk mengirimkan donasi sebesar <strong className="text-neutral-700 font-semibold">Rp {getFinalAmount().toLocaleString("id-ID")}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {[
              { id: "qris", name: "QRIS / GoPay / ShopeePay / OVO", desc: "Bayar instan pakai kode QR", icon: QrCode },
              { id: "transfer", name: "Transfer Virtual Account", desc: "Mandiri, BCA, BRI, BNI", icon: CreditCard },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-amber-50/40 shadow-sm"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-primary text-white" : "bg-neutral-100 text-neutral-500"
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{method.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{method.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              className="flex-1 h-11 rounded-xl"
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmPayment}
              className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary/95 text-white"
            >
              Konfirmasi Bayar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-sm rounded-3xl p-8 border-neutral-100 text-center shadow-xl bg-white">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
            <CheckCircle2 size={32} />
          </div>
          <DialogTitle className="text-xl font-bold text-neutral-900" style={{ fontFamily: "var(--font-poppins, Poppins)" }}>
            Terima Kasih Banyak!
          </DialogTitle>
          <DialogDescription className="text-neutral-500 text-sm mt-2 leading-relaxed">
            Dukungan donasi sebesar <strong className="text-neutral-700">Rp {getFinalAmount().toLocaleString("id-ID")}</strong>{name ? ` dari ${name}` : ""} telah kami terima. Dukunganmu sangat berarti bagi kelangsungan platform Tuloong!
          </DialogDescription>
          {message && (
            <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100/50 text-xs italic text-neutral-600 leading-relaxed">
              "{message}"
            </div>
          )}
          <Button
            onClick={handleReset}
            className="w-full h-11 rounded-xl mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            Tutup & Kembali
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
