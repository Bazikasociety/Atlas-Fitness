"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

// Créneaux horaires disponibles
const TIME_SLOTS = ["09H00", "11H00", "14H00", "16H00", "18H00"];

// Validation Zod
const bookingSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro invalide"),
  comment: z.string().optional(),
  type: z.enum(["discovery", "subscription"]),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Lundi = 0
}

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

// Mini calendrier custom
function AtlasCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  function isPast(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d < t;
  }

  function isSelected(day: number) {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  }

  return (
    <div className="border border-[#1F1F1F] p-6">
      {/* Nav mois */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 hover:text-[#22C55E] transition-colors"
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-display text-lg tracking-tight uppercase">
          {MONTHS_FR[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 hover:text-[#22C55E] transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_FR.map((d) => (
          <div key={d} className="font-body text-xs text-[#A1A1AA] text-center py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Jours du mois */}
      <div className="grid grid-cols-7 gap-1">
        {/* Cases vides avant le 1er */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {/* Jours */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const past = isPast(day);
          const selected = isSelected(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => !past && onSelect(new Date(viewYear, viewMonth, day))}
              disabled={past}
              aria-label={`${day} ${MONTHS_FR[viewMonth]}`}
              aria-pressed={selected}
              className={`font-body text-sm py-2.5 transition-all duration-150 ${
                selected
                  ? "bg-[#22C55E] text-black font-semibold"
                  : past
                  ? "text-[#A1A1AA]/30 cursor-not-allowed"
                  : "hover:bg-[#1F1F1F] hover:text-[#22C55E]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BookingForm() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // État du flow PayPal (après la création de la booking)
  const [bookingId, setBookingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { type: "discovery" },
  });

  const bookingType = watch("type");
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";
  const paypalReady =
    paypalClientId && !paypalClientId.includes("VOTRE_CLIENT_ID");

  async function onSubmit(data: BookingFormValues) {
    if (!selectedDate || !selectedSlot) {
      setError("Veuillez choisir une date et un créneau.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          date: selectedDate.toISOString(),
          timeSlot: selectedSlot,
        }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error ?? "Erreur serveur");

      // Découverte → redirect /merci directement
      if (data.type === "discovery") {
        router.push("/merci");
        return;
      }

      // Forfait → on passe à l'étape PayPal
      setBookingId(json.bookingId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  // Vue PayPal — après validation du formulaire pour un forfait
  if (bookingId && bookingType === "subscription") {
    return (
      <div className="max-w-xl mx-auto text-center">
        <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
          ÉTAPE FINALE · PAIEMENT
        </p>
        <h3 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none tracking-tighter text-white mb-6">
          150€ · FORFAIT REMISE EN FORME
        </h3>
        <p className="font-body text-[#A1A1AA] mb-8">
          Validez votre paiement en toute sécurité via PayPal. Vous pouvez payer avec votre compte PayPal ou par carte bancaire.
        </p>

        {paypalReady ? (
          <PayPalScriptProvider
            options={{
              clientId: paypalClientId,
              currency: "EUR",
              intent: "capture",
              locale: "fr_FR",
            }}
          >
            <PayPalButtons
              style={{
                layout: "vertical",
                color: "black",
                shape: "rect",
                label: "paypal",
              }}
              createOrder={async () => {
                const res = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ bookingId }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error ?? "Erreur PayPal");
                return data.orderId;
              }}
              onApprove={async (data) => {
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: data.orderID }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error ?? "Capture échouée");
                router.push("/merci");
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                setError("Une erreur est survenue avec PayPal. Réessayez ou contactez-nous.");
              }}
              onCancel={() => {
                setError("Paiement annulé. Vous pouvez recommencer quand vous voulez.");
              }}
            />
          </PayPalScriptProvider>
        ) : (
          <div className="border border-yellow-500/30 bg-yellow-500/5 p-6 text-left">
            <p className="font-body text-sm text-yellow-300 mb-3">
              ⚠️ PayPal n'est pas encore configuré.
            </p>
            <p className="font-body text-xs text-[#A1A1AA]">
              Votre réservation a été enregistrée. Yann vous contactera pour finaliser le paiement.
            </p>
          </div>
        )}

        {error && (
          <p className="mt-6 font-body text-xs text-red-400 border border-red-500/30 px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setBookingId(null);
            setError(null);
          }}
          className="mt-8 font-body text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-white transition-colors"
        >
          ← Modifier ma réservation
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* Colonne gauche — Calendrier + créneaux */}
        <div className="space-y-8">
          <div>
            <p className="font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-4">
              Choisissez une date
            </p>
            <AtlasCalendar selectedDate={selectedDate} onSelect={setSelectedDate} />
          </div>

          {selectedDate && (
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-4 flex items-center gap-2">
                <Clock size={12} />
                Créneaux disponibles
              </p>
              <div className="flex flex-wrap gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    aria-pressed={selectedSlot === slot}
                    className={`font-body text-sm uppercase tracking-widest px-6 py-3 border transition-all duration-200 ${
                      selectedSlot === slot
                        ? "bg-[#22C55E] text-black border-[#22C55E]"
                        : "bg-transparent text-white border-[#1F1F1F] hover:border-[#22C55E] hover:text-[#22C55E]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite — Formulaire */}
        <div className="space-y-6">
          {/* Type de séance */}
          <fieldset>
            <legend className="font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-4">
              Type de réservation
            </legend>
            <div className="space-y-3">
              {[
                {
                  value: "discovery",
                  label: "SÉANCE DÉCOUVERTE",
                  detail: "Gratuite · 45 min",
                },
                {
                  value: "subscription",
                  label: "FORFAIT REMISE EN FORME",
                  detail: "150€ / mois · Paiement PayPal",
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-4 p-4 border cursor-pointer transition-all duration-200 ${
                    bookingType === opt.value
                      ? "border-[#22C55E] bg-[#22C55E]/5"
                      : "border-[#1F1F1F] hover:border-[#A1A1AA]"
                  }`}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register("type")}
                    className="sr-only"
                  />
                  <span
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      bookingType === opt.value
                        ? "border-[#22C55E]"
                        : "border-[#A1A1AA]"
                    }`}
                  >
                    {bookingType === opt.value && (
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    )}
                  </span>
                  <div>
                    <p className="font-body font-semibold text-sm uppercase tracking-wider text-white">
                      {opt.label}
                    </p>
                    <p className="font-body text-xs text-[#A1A1AA]">{opt.detail}</p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Champs formulaire */}
          {[
            { name: "name" as const, label: "Nom complet", type: "text", required: true },
            { name: "email" as const, label: "Email", type: "email", required: true },
            { name: "phone" as const, label: "Téléphone", type: "tel", required: true },
          ].map((field) => (
            <div key={field.name}>
              <label className="block font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
                {field.label} {field.required && <span className="text-[#22C55E]">*</span>}
              </label>
              <input
                type={field.type}
                {...register(field.name)}
                autoComplete={field.name === "name" ? "name" : field.name}
                className={`w-full bg-[#1F1F1F] border text-white placeholder-[#A1A1AA]/50 font-body text-sm px-5 py-4 focus:outline-none transition-colors ${
                  errors[field.name]
                    ? "border-red-500 focus:border-red-400"
                    : "border-[#1F1F1F] focus:border-[#22C55E]"
                }`}
              />
              {errors[field.name] && (
                <p className="font-body text-xs text-red-400 mt-1">
                  {errors[field.name]?.message}
                </p>
              )}
            </div>
          ))}

          {/* Commentaire */}
          <div>
            <label className="block font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              {...register("comment")}
              rows={3}
              placeholder="Objectifs, questions, disponibilités..."
              className="w-full bg-[#1F1F1F] border border-[#1F1F1F] text-white placeholder-[#A1A1AA]/50 font-body text-sm px-5 py-4 focus:outline-none focus:border-[#22C55E] transition-colors resize-none"
            />
          </div>

          {/* Erreur globale */}
          {error && (
            <p className="font-body text-xs text-red-400 border border-red-500/30 px-4 py-3">
              {error}
            </p>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-3 bg-[#22C55E] text-black font-body font-semibold uppercase tracking-widest text-sm py-6 hover:bg-[#16A34A] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "EN COURS..."
              : bookingType === "subscription"
              ? "CONTINUER VERS PAYPAL →"
              : "CONFIRMER MA SÉANCE →"}
            {!loading && (
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            )}
          </button>

          <p className="font-body text-xs text-[#A1A1AA] text-center">
            Réponse sous 24h · Paiement sécurisé PayPal
          </p>
        </div>
      </div>
    </form>
  );
}
