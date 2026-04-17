import type { Metadata } from "next";
import { QuizClient } from "@/components/quiz/quiz-client";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "Quiz Santé — Évaluez vos habitudes sur 20",
  description:
    "8 questions basées sur les recommandations de l'OMS et les données INSEE. Obtenez votre note sur 20 et des conseils personnalisés.",
};

export default function QuizPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-20">
        <QuizClient />
      </main>
    </>
  );
}
