import { Send, Users, Award, XCircle } from "lucide-react";

export const STATUSES = [
  {
    key: "basvuruldu",
    label: "Başvuruldu",
    dot: "bg-slate-400",
    accent: "border-l-slate-400",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    icon: Send,
  },
  {
    key: "mulakat",
    label: "Mülakat",
    dot: "bg-indigo-500",
    accent: "border-l-indigo-500",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    icon: Users,
  },
  {
    key: "teklif",
    label: "Teklif",
    dot: "bg-emerald-500",
    accent: "border-l-emerald-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    icon: Award,
  },
  {
    key: "red",
    label: "Red",
    dot: "bg-red-400",
    accent: "border-l-red-400",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    icon: XCircle,
  },
];

//durum listesi hem kanban-board.tsx'te hem page.tsx'te (istatistik kartları için) kullanılacak.