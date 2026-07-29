import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-teal-600" size={48} />
      <p className="text-gray-500 font-medium">Memuat halaman...</p>
    </div>
  );
}
