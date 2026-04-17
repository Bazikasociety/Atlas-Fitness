"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Users, Calendar, BookOpen, Activity, Target } from "lucide-react";

interface Stats {
  totalClients: number;
  activeClients: number;
  mrr: number;
  totalBookings: number;
  pendingBookings: number;
  totalArticles: number;
  totalQuizResponses: number;
  quizLeads: number;
  avgQuizScore: number;
  conversionRate: number;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className={`border p-6 ${accent ? "border-[#22C55E] bg-[#22C55E]/5" : "border-[#1F1F1F]"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-body text-xs uppercase tracking-widest text-[#A1A1AA]">{label}</p>
        <Icon size={16} className={accent ? "text-[#22C55E]" : "text-[#A1A1AA]"} />
      </div>
      <p
        className={`font-display text-4xl md:text-5xl leading-none tracking-tighter ${
          accent ? "text-[#22C55E]" : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="font-body text-xs text-[#A1A1AA] mt-2">{sub}</p>
      )}
    </div>
  );
}

export function StatsOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border border-[#1F1F1F] p-6 animate-pulse">
            <div className="h-3 bg-[#1F1F1F] w-24 mb-4" />
            <div className="h-10 bg-[#1F1F1F] w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return <p className="text-[#A1A1AA] font-body text-sm">Erreur chargement.</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard
          label="MRR"
          value={`${stats.mrr.toLocaleString("fr-FR")} €`}
          sub="Revenus mensuels récurrents"
          icon={TrendingUp}
          accent
        />
        <StatCard
          label="Clients actifs"
          value={stats.activeClients}
          sub={`${stats.totalClients} au total`}
          icon={Users}
        />
        <StatCard
          label="Réservations"
          value={stats.totalBookings}
          sub={`${stats.pendingBookings} en attente`}
          icon={Calendar}
        />
        <StatCard
          label="Quiz complétés"
          value={stats.totalQuizResponses}
          sub={`${stats.quizLeads} leads email`}
          icon={Activity}
        />
        <StatCard
          label="Score quiz moyen"
          value={`${stats.avgQuizScore} / 20`}
          sub="Basé sur tous les quiz"
          icon={Target}
        />
        <StatCard
          label="Taux conversion"
          value={`${stats.conversionRate}%`}
          sub="Quiz → Réservation"
          icon={BookOpen}
        />
      </div>
    </div>
  );
}
