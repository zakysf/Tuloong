import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="mitra">{children}</DashboardLayout>;
}
