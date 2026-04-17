"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Users, Calendar, BookOpen, BarChart3, Activity } from "lucide-react";
import { ClientsTable } from "./clients-table";
import { BookingsList } from "./bookings-list";
import { ArticlesCrud } from "./articles-crud";
import { StatsOverview } from "./stats-overview";
import { QuizStats } from "./quiz-stats";

const TABS = [
  { id: "stats", label: "Statistiques", icon: BarChart3 },
  { id: "clients", label: "Clients", icon: Users },
  { id: "bookings", label: "Réservations", icon: Calendar },
  { id: "articles", label: "Journal", icon: BookOpen },
  { id: "quiz", label: "Quiz", icon: Activity },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("stats");
  const [exporting, setExporting] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/admin/export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `atlas-fitness-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header admin */}
      <header className="sticky top-0 z-40 border-b border-[#1F1F1F] bg-[#0A0A0A]/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 md:px-10 h-16">
          <div className="flex items-center gap-3">
            <span className="font-display text-xl tracking-tight text-white">ATLAS FITNESS</span>
            <span className="font-body text-xs text-[#A1A1AA] uppercase tracking-wider">/ Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="font-body text-xs uppercase tracking-widest px-5 py-2.5 bg-[#22C55E] text-black hover:bg-[#16A34A] transition-colors disabled:opacity-60"
            >
              {exporting ? "EXPORT..." : "EXPORT EXCEL"}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-[#A1A1AA] hover:text-white transition-colors"
              aria-label="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-8">
        {/* Navigation onglets */}
        <nav className="flex gap-1 mb-8 overflow-x-auto" role="tablist">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 font-body text-xs uppercase tracking-widest px-5 py-3 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-[#22C55E] text-black"
                    : "text-[#A1A1AA] border border-[#1F1F1F] hover:border-white hover:text-white"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Contenu onglets */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "stats" && <StatsOverview />}
          {activeTab === "clients" && <ClientsTable />}
          {activeTab === "bookings" && <BookingsList />}
          {activeTab === "articles" && <ArticlesCrud />}
          {activeTab === "quiz" && <QuizStats />}
        </motion.div>
      </div>
    </div>
  );
}
