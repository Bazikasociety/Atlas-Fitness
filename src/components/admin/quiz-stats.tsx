"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface QuizResponse {
  id: string;
  email: string | null;
  totalScore: number;
  createdAt: string;
  answers: string;
}

function getLabel(score: number) {
  if (score >= 17) return { label: "EXCELLENT", color: "#22C55E" };
  if (score >= 13) return { label: "CORRECT", color: "#EAB308" };
  if (score >= 8) return { label: "À AMÉLIORER", color: "#F97316" };
  return { label: "SIGNAL D'ALARME", color: "#EF4444" };
}

export function QuizStats() {
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/quiz")
      .then((r) => r.json())
      .then((data) => {
        setResponses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const withEmail = responses.filter((r) => r.email);
  const avgScore = responses.length
    ? (responses.reduce((s, r) => s + r.totalScore, 0) / responses.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-6">
      {/* Stats résumé */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Quiz réalisés", value: responses.length },
          { label: "Leads email", value: withEmail.length },
          { label: "Score moyen", value: avgScore + " / 20" },
        ].map((s) => (
          <div key={s.label} className="border border-[#1F1F1F] p-6">
            <p className="font-display text-3xl text-white mb-1">{s.value}</p>
            <p className="font-body text-xs uppercase tracking-widest text-[#A1A1AA]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Liste des réponses */}
      <div className="border border-[#1F1F1F]">
        <div className="p-6 border-b border-[#1F1F1F]">
          <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs">
            — RÉPONSES QUIZ
          </p>
        </div>

        {loading ? (
          <p className="font-body text-[#A1A1AA] text-sm p-6">Chargement...</p>
        ) : responses.length === 0 ? (
          <p className="font-body text-[#A1A1AA] text-sm p-6">Aucune réponse pour le moment.</p>
        ) : (
          <div className="divide-y divide-[#1F1F1F]">
            {responses.map((r) => {
              const { label, color } = getLabel(r.totalScore);
              return (
                <div key={r.id} className="p-6 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-white truncate">
                      {r.email ?? <span className="text-[#A1A1AA] italic">Anonyme</span>}
                    </p>
                    <p className="font-body text-xs text-[#A1A1AA] mt-1">
                      {formatDate(new Date(r.createdAt))}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-2xl text-white">
                      {r.totalScore}<span className="text-sm text-[#A1A1AA]">/20</span>
                    </p>
                    <p className="font-body text-xs mt-1" style={{ color }}>{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
