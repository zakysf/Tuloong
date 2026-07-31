import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function PelangganLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="pelanggan">{children}</DashboardLayout>;
}
