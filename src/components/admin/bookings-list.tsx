"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  type: string;
  status: string;
  comment: string | null;
}

const STATUS_OPTIONS = ["pending", "confirmed", "paid", "canceled", "no_show"];
const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  paid: "Payé",
  canceled: "Annulé",
  no_show: "Absent",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-blue-500/20 text-blue-400",
  paid: "bg-[#22C55E]/20 text-[#22C55E]",
  canceled: "bg-red-500/20 text-red-400",
  no_show: "bg-[#A1A1AA]/20 text-[#A1A1AA]",
};

export function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-[#1F1F1F] animate-pulse" />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="border border-[#1F1F1F] p-12 text-center">
        <p className="font-display text-2xl text-white mb-2">AUCUNE RÉSERVATION</p>
        <p className="font-body text-sm text-[#A1A1AA]">Les réservations apparaîtront ici.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-body text-sm">
        <thead>
          <tr className="border-b border-[#1F1F1F]">
            {["Date", "Créneau", "Client", "Email", "Type", "Statut", "Note"].map((h) => (
              <th
                key={h}
                className="text-left py-3 px-3 text-xs uppercase tracking-wider text-[#A1A1AA] font-normal whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1F1F1F]">
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-[#1F1F1F]/40 transition-colors">
              <td className="py-3 px-3 text-white whitespace-nowrap">{formatDate(b.date)}</td>
              <td className="py-3 px-3 text-[#22C55E] font-medium whitespace-nowrap">{b.timeSlot}</td>
              <td className="py-3 px-3 text-white whitespace-nowrap">{b.name}</td>
              <td className="py-3 px-3 text-[#A1A1AA]">
                <a href={`mailto:${b.email}`} className="hover:text-[#22C55E] transition-colors">
                  {b.email}
                </a>
              </td>
              <td className="py-3 px-3 whitespace-nowrap">
                <span className={`text-xs uppercase tracking-wider px-3 py-1 ${
                  b.type === "subscription"
                    ? "bg-[#22C55E]/20 text-[#22C55E]"
                    : "bg-[#1F1F1F] text-[#A1A1AA]"
                }`}>
                  {b.type === "subscription" ? "Forfait" : "Découverte"}
                </span>
              </td>
              <td className="py-3 px-3">
                <select
                  value={b.status}
                  onChange={(e) => updateStatus(b.id, e.target.value)}
                  aria-label="Statut réservation"
                  className={`text-xs uppercase tracking-wider px-3 py-1.5 border-0 focus:outline-none cursor-pointer ${
                    STATUS_COLORS[b.status] ?? "bg-[#1F1F1F] text-[#A1A1AA]"
                  }`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="bg-[#0A0A0A] text-white normal-case">
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-3 px-3 text-[#A1A1AA] text-xs max-w-[200px] truncate">
                {b.comment || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
