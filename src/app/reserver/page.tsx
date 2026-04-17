import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookingForm } from "@/components/booking/booking-form";

export const metadata: Metadata = {
  title: "Réserver — Atlas Fitness",
  description:
    "Réservez votre séance découverte gratuite ou votre forfait remise en forme avec Yann Bazika. Réponse sous 24h.",
};

export default function ReserverPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-32 pb-24">
        <div className="section-container">

          {/* Header */}
          <div className="mb-16">
            <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
              — RÉSERVATION
            </p>
            <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-white mb-4">
              RÉSERVEZ
              <br />
              <span className="text-outline-2 text-white">VOTRE SÉANCE</span>
            </h1>
            <p className="font-body text-[#A1A1AA] max-w-md leading-relaxed">
              Choisissez une date et laissez vos coordonnées. Je vous recontacte sous 24h pour confirmer.
            </p>
          </div>

          {/* Formulaire */}
          <BookingForm />

        </div>
      </main>
      <Footer />
    </>
  );
}
