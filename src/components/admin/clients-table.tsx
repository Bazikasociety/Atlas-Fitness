"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  subscriptionStatus: string | null;
  totalPaid: number;
  notes: string | null;
  quizResponses: { totalScore: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-[#22C55E]/20 text-[#22C55E]",
  canceled: "bg-red-500/20 text-red-400",
  past_due: "bg-orange-500/20 text-orange-400",
};

export function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");

  useEffect(() => {
    fetch("/api/admin/clients")
      .then((r) => r.json())
      .then(setClients)
      .finally(() => setLoading(false));
  }, []);

  async function saveNote(id: string) {
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, notes: noteValue }),
    });
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes: noteValue } : c))
    );
    setEditingNote(null);
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-[#1F1F1F] animate-pulse" />
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="border border-[#1F1F1F] p-12 text-center">
        <p className="font-display text-2xl text-white mb-2">AUCUN CLIENT</p>
        <p className="font-body text-sm text-[#A1A1AA]">
          Les clients apparaîtront ici après leur première réservation.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-body text-sm" aria-label="Liste des clients">
        <thead>
          <tr className="border-b border-[#1F1F1F]">
            {["Nom", "Email", "Téléphone", "Inscription", "Statut", "Payé", "Score", "Notes"].map(
              (h) => (
                <th
                  key={h}
                  className="text-left py-3 px-3 text-xs uppercase tracking-wider text-[#A1A1AA] font-normal whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1F1F1F]">
          {clients.map((c) => (
            <tr key={c.id} className="hover:bg-[#1F1F1F]/40 transition-colors">
              <td className="py-3 px-3 font-medium text-white whitespace-nowrap">{c.name}</td>
              <td className="py-3 px-3 text-[#A1A1AA]">
                <a href={`mailto:${c.email}`} className="hover:text-[#22C55E] transition-colors">
                  {c.email}
                </a>
              </td>
              <td className="py-3 px-3 text-[#A1A1AA] whitespace-nowrap">{c.phone}</td>
              <td className="py-3 px-3 text-[#A1A1AA] whitespace-nowrap">
                {formatDate(c.createdAt)}
              </td>
              <td className="py-3 px-3">
                {c.subscriptionStatus ? (
                  <span
                    className={`text-xs uppercase tracking-wider px-3 py-1 ${
                      STATUS_COLORS[c.subscriptionStatus] ?? "bg-[#1F1F1F] text-[#A1A1AA]"
                    }`}
                  >
                    {c.subscriptionStatus}
                  </span>
                ) : (
                  <span className="text-[#A1A1AA]">—</span>
                )}
              </td>
              <td className="py-3 px-3 text-white whitespace-nowrap">
                {c.totalPaid > 0 ? `${(c.totalPaid / 100).toLocaleString("fr-FR")} €` : "—"}
              </td>
              <td className="py-3 px-3 text-[#A1A1AA] whitespace-nowrap">
                {c.quizResponses[0]?.totalScore?.toFixed(1) ?? "—"}
              </td>
              <td className="py-3 px-3 min-w-[200px]">
                {editingNote === c.id ? (
                  <div className="flex gap-2">
                    <input
                      value={noteValue}
                      onChange={(e) => setNoteValue(e.target.value)}
                      className="flex-1 bg-[#1F1F1F] border border-[#22C55E] text-white text-xs px-2 py-1 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => saveNote(c.id)}
                      className="text-xs text-[#22C55E] hover:text-white transition-colors px-2"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      className="text-xs text-[#A1A1AA] hover:text-white transition-colors px-1"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingNote(c.id);
                      setNoteValue(c.notes ?? "");
                    }}
                    className="text-left text-[#A1A1AA] hover:text-white transition-colors text-xs w-full truncate"
                  >
                    {c.notes || <span className="text-[#A1A1AA]/40 italic">Ajouter une note...</span>}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
