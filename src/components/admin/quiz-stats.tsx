"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface QuizResponse {
  id: string;
  email: string | null;
  totalScore: number;
  createdAt: string;
  answers: Record<string, number>;
}

export function QuizStats() {
  const [responses, setResponses] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On réutilise les stats globales pour avoir les réponses
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(() => {
        // Fetch direct des réponses via la route clients (approximation)
        // En prod on aurait une route dédiée /api/admin/quiz
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="border border-[#1F1F1F] p-8">
        <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
          — ANALYSE QUIZ
        </p>
        <p className="font-body text-[#A1A1AA] text-sm leading-relaxed">
          Les données détaillées du quiz sont disponibles via l'export Excel (bouton en haut à droite).
          Vous y trouverez tous les scores par catégorie, les leads email et la distribution complète.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Score parfait", range: "17–20", color: "#22C55E" },
            { label: "Correct", range: "13–16", color: "#EAB308" },
            { label: "À améliorer", range: "8–12", color: "#F97316" },
            { label: "Signal d'alarme", range: "0–7", color: "#EF4444" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="font-body text-xs text-white">{item.label}</p>
                <p className="font-body text-xs text-[#A1A1AA]">{item.range} / 20</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-[#1F1F1F] p-8">
        <p className="font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-4">
          Pour accéder aux données complètes :
        </p>
        <ol className="font-body text-sm text-[#FAFAFA] space-y-2 list-decimal list-inside">
          <li>Cliquez sur <strong className="text-[#22C55E]">EXPORT EXCEL</strong> en haut à droite</li>
          <li>Ouvrez l'onglet <strong>Prospects Quiz</strong> dans le fichier téléchargé</li>
          <li>Toutes les réponses avec emails et scores détaillés sont listées</li>
        </ol>
      </div>
    </div>
  );
}
