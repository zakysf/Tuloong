import type { Metadata } from "next";
import LandingClient from "@/components/landing/LandingClient";

export const metadata: Metadata = {
  title: "Tuloong — Jasa Suruh Terdekat Terpercaya",
  description:
    "Reverse marketplace jasa suruh yang menghubungkan Anda dengan Mitra pekerja informal terverifikasi secara aman dan transparan.",
};

export default function LandingPage() {
  return <LandingClient />;
}
