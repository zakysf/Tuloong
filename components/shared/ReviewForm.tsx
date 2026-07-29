"use client";

import { useState } from "react";
import { Star, Loader2, X } from "lucide-react";
import { createReview } from "@/lib/services/review.service";
import { Button } from "@/components/ui/button";

interface ReviewFormProps {
  transactionId: number;
  mitraName: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function ReviewForm({ transactionId, mitraName, onSuccess, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [komentar, setKomentar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Silakan berikan rating bintang terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await createReview(transactionId, {
        rating,
        review: komentar,
      });
      onSuccess(); // Will trigger donation popup from parent
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengirim ulasan.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Beri Ulasan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-gray-500 text-center">
            Bagaimana kinerja <span className="font-semibold text-gray-900">{mitraName}</span> dalam menyelesaikan pekerjaan ini?
          </p>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={36}
                  className={`${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-100 text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Komentar (Opsional)
            </label>
            <textarea
              className="w-full h-24 p-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none"
              placeholder="Ceritakan pengalaman Anda..."
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 h-11"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Kirim Ulasan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
