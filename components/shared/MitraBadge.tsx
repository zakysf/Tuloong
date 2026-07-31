import { Medal } from "lucide-react";

interface MitraBadgeProps {
  badge: "baru" | "terpercaya" | "profesional" | string;
  className?: string;
}

export function MitraBadge({ badge, className = "" }: MitraBadgeProps) {
  let badgeConfig = {
    label: "Mitra Baru",
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
    borderColor: "border-amber-200",
    iconColor: "text-amber-600",
  };

  if (badge === "terpercaya") {
    badgeConfig = {
      label: "Terpercaya",
      bgColor: "bg-slate-100",
      textColor: "text-slate-800",
      borderColor: "border-slate-300",
      iconColor: "text-slate-500",
    };
  } else if (badge === "profesional") {
    badgeConfig = {
      label: "Profesional",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-300",
      iconColor: "text-yellow-600",
    };
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm ${badgeConfig.bgColor} ${badgeConfig.textColor} ${badgeConfig.borderColor} ${className}`}
      title={`Status Mitra: ${badgeConfig.label}`}
    >
      <Medal size={14} className={badgeConfig.iconColor} />
      {badgeConfig.label}
    </div>
  );
}
