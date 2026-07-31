"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  History,
  UserCircle,
  Search,
  Briefcase,
  Users,
  Settings,
  AlertTriangle,
  Menu,
  LogOut,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "pelanggan" | "mitra" | "admin";
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    } else if (!isLoading && isAuthenticated && user?.role !== role) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, role, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || user?.role !== role) {
    return null; // Akan redirect ke login
  }

  let navItems: NavItem[] = [];

  if (role === "pelanggan") {
    navItems = [
      { name: "Dashboard", href: "/pelanggan", icon: <LayoutDashboard size={20} /> },
      { name: "Buat Postingan", href: "/pelanggan/posts/buat", icon: <PlusCircle size={20} /> },
      { name: "Postingan Saya", href: "/pelanggan/posts", icon: <ListTodo size={20} /> },
      { name: "Riwayat Transaksi", href: "/pelanggan/transaksi", icon: <History size={20} /> },
      { name: "Profil", href: "/pelanggan/profil", icon: <UserCircle size={20} /> },
    ];
  } else if (role === "mitra") {
    const isMitraActive = user?.mitra_profile?.verification_status === 'aktif';
    if (!isMitraActive) {
      navItems = [
        { name: "Status Pendaftaran", href: "/mitra", icon: <LayoutDashboard size={20} /> },
        { name: "Profil", href: "/mitra/profil", icon: <UserCircle size={20} /> },
      ];
    } else {
      navItems = [
        { name: "Dashboard", href: "/mitra", icon: <LayoutDashboard size={20} /> },
        { name: "Cari Job", href: "/mitra/jobs", icon: <Search size={20} /> },
        { name: "Job Saya", href: "/mitra/my-jobs", icon: <Briefcase size={20} /> },
        { name: "Riwayat Transaksi", href: "/mitra/transaksi", icon: <History size={20} /> },
        { name: "Profil", href: "/mitra/profil", icon: <UserCircle size={20} /> },
      ];
    }
  } else if (role === "admin") {
    navItems = [
      { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
      { name: "Verifikasi Mitra", href: "/admin/mitra", icon: <Users size={20} /> },
      { name: "Transaksi", href: "/admin/transaksi", icon: <History size={20} /> },
      { name: "Laporan", href: "/admin/laporan", icon: <AlertTriangle size={20} /> },
      { name: "Pengaturan", href: "/admin/pengaturan", icon: <Settings size={20} /> },
    ];
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <img src="/loger.png" alt="Tuloong Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg text-teal-800">Tuloong</span>
          </Link>
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-teal-50 text-teal-800 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user.foto_profil ? (
                <img src={user.foto_profil} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserCircle size={24} className="text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.nama}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={logout}
          >
            <LogOut size={16} className="mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex-shrink-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 md:hidden">
          <button
            className="p-2 -ml-2 text-gray-500 hover:text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <span className="ml-2 font-bold text-gray-900 capitalize">{role} Dashboard</span>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
