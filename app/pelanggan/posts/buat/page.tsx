"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPost, parsePostError } from "@/lib/services/post.service";
import {
  getProvinces,
  getRegencies,
  getDistricts,
  type WilayahOption,
} from "@/lib/services/wilayah.service";
import FormInput from "@/components/shared/FormInput";
import FormTextarea from "@/components/shared/FormTextarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import FormSelect from "@/components/shared/FormSelect";

const postSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter").max(255),
  deskripsi: z.string().min(20, "Deskripsi minimal 20 karakter"),
  estimasi_waktu: z.string().min(1, "Estimasi waktu wajib diisi"),
  budget: z.coerce.number().min(5000, "Budget minimal Rp 5.000"),
  urgensi: z.enum(["biasa", "penting", "mendesak"]),
});

type PostForm = z.infer<typeof postSchema>;

export default function BuatPostinganPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  // Data wilayah
  const [provinces, setProvinces] = useState<WilayahOption[]>([]);
  const [regencies, setRegencies] = useState<WilayahOption[]>([]);
  const [districts, setDistricts] = useState<WilayahOption[]>([]);

  // Selected values & names
  const [provId, setProvId] = useState("");
  const [provName, setProvName] = useState("");
  const [regId, setRegId] = useState("");
  const [regName, setRegName] = useState("");
  const [distId, setDistId] = useState("");
  const [distName, setDistName] = useState("");

  const [locError, setLocError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      urgensi: "biasa",
    },
  });

  useEffect(() => {
    getProvinces().then(setProvinces);
  }, []);

  const handleProvChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setProvId(id);
    setProvName(name);
    setRegId("");
    setRegName("");
    setDistId("");
    setDistName("");
    setDistricts([]);
    if (id) {
      const data = await getRegencies(id);
      setRegencies(data);
    } else {
      setRegencies([]);
    }
  };

  const handleRegChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setRegId(id);
    setRegName(name);
    setDistId("");
    setDistName("");
    if (id) {
      const data = await getDistricts(id);
      setDistricts(data);
    } else {
      setDistricts([]);
    }
  };

  const handleDistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistId(e.target.value);
    setDistName(e.target.options[e.target.selectedIndex].text);
  };

  const onSubmit = async (data: PostForm) => {
    setServerError(null);
    setLocError("");

    if (!provName || !regName || !distName) {
      setLocError("Lengkapi lokasi (Provinsi, Kabupaten, Kecamatan).");
      return;
    }

    try {
      await createPost({
        ...data,
        provinsi: provName,
        kabupaten: regName,
        kecamatan: distName,
      });
      router.push("/pelanggan/posts");
    } catch (err) {
      setServerError(parsePostError(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/pelanggan" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Kembali ke Dashboard
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Buat Postingan Jasa</h1>
          <p className="text-gray-500 mt-1">Jelaskan dengan detail bantuan apa yang Anda butuhkan.</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            label="Judul Pekerjaan"
            placeholder="Contoh: Tolong belikan galon air dan angkat ke lantai 2"
            error={errors.judul?.message}
            {...register("judul")}
          />

          <FormTextarea
            label="Deskripsi Detail"
            placeholder="Jelaskan secara spesifik apa saja yang harus dilakukan..."
            rows={4}
            error={errors.deskripsi?.message}
            {...register("deskripsi")}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              label="Estimasi Waktu"
              placeholder="Contoh: Hari ini jam 15:00 / Secepatnya"
              error={errors.estimasi_waktu?.message}
              {...register("estimasi_waktu")}
            />
            
            <FormInput
              label="Budget Jasa (Rp)"
              type="number"
              placeholder="Contoh: 50000"
              error={errors.budget?.message}
              {...register("budget")}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-900">Tingkat Urgensi</label>
            <div className="grid grid-cols-3 gap-3">
              {["biasa", "penting", "mendesak"].map((lvl) => (
                <label key={lvl} className="cursor-pointer">
                  <input
                    type="radio"
                    value={lvl}
                    className="peer sr-only"
                    {...register("urgensi")}
                  />
                  <div className="text-center py-2 px-3 border rounded-xl text-sm font-medium transition-colors peer-checked:bg-teal-50 peer-checked:border-teal-600 peer-checked:text-teal-700 bg-white hover:bg-gray-50 capitalize">
                    {lvl}
                  </div>
                </label>
              ))}
            </div>
            {errors.urgensi && <p className="text-red-500 text-xs">{errors.urgensi.message}</p>}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Lokasi Pekerjaan</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Provinsi</label>
                <select
                  value={provId}
                  onChange={handleProvChange}
                  className="w-full h-11 px-3 border rounded-xl text-sm bg-white"
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Kabupaten/Kota</label>
                <select
                  value={regId}
                  onChange={handleRegChange}
                  disabled={!provId}
                  className="w-full h-11 px-3 border rounded-xl text-sm bg-white disabled:bg-gray-50"
                >
                  <option value="">Pilih Kabupaten</option>
                  {regencies.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Kecamatan</label>
                <select
                  value={distId}
                  onChange={handleDistChange}
                  disabled={!regId}
                  className="w-full h-11 px-3 border rounded-xl text-sm bg-white disabled:bg-gray-50"
                >
                  <option value="">Pilih Kecamatan</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            {locError && <p className="text-red-500 text-xs mt-2">{locError}</p>}
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-700 hover:bg-teal-800 text-white min-w-[180px] h-11"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : "Posting Sekarang"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
