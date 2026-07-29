"use client";

import { X, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationPopupProps {
  onClose: () => void;
}

export default function DonationPopup({ onClose }: DonationPopupProps) {
  // Dalam implementasi nyata, donasi ini bisa diarahkan ke halaman Midtrans tersendiri 
  // atau ke rekening Yayasan Tuloong.
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200 text-center">
        
        <div className="bg-teal-700 p-8 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-teal-200 hover:text-white"
          >
            <X size={20} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <HeartHandshake size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Terima Kasih!</h2>
          <p className="text-teal-50 text-sm">Ulasan Anda sangat berarti bagi kelangsungan platform Tuloong.</p>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Tuloong beroperasi tanpa mengambil potongan dari Mitra maupun membebani Pelanggan. 
            Jika Anda merasa terbantu, mari dukung kami agar terus bisa menebar kebaikan.
          </p>

          <div className="space-y-3">
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold h-12"
              onClick={() => {
                alert("Fitur donasi akan diarahkan ke Payment Gateway (Midtrans) atau Tautan Eksternal Saweria.");
                onClose();
              }}
            >
              Donasi Sekarang
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-gray-500 hover:text-gray-700 h-12"
              onClick={onClose}
            >
              Nanti Saja
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
