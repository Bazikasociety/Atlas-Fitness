"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { QUIZ_QUESTIONS, interpretScore, getPersonalizedAdvice } from "@/lib/quiz-data";
import { QuizLanding } from "./quiz-landing";
import { QuizQuestion } from "./quiz-question";
import { QuizResult } from "./quiz-result";

type QuizState = "landing" | "questions" | "calculating" | "result";

export function QuizClient() {
  const [state, setState] = useState<QuizState>("landing");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalScore = Object.values(answers).reduce((sum, s) => sum + s, 0);

  function handleStart() {
    setState("questions");
    setCurrentQuestion(0);
    setAnswers({});
  }

  function handleAnswer(questionId: string, score: number) {
    const newAnswers = { ...answers, [questionId]: score };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      // Dernière question — calcul du score
      setState("calculating");
      const finalScore = Object.values(newAnswers).reduce((sum, s) => sum + s, 0);

      // Envoi en DB (silencieux, pas bloquant)
      fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: newAnswers, totalScore: finalScore }),
      }).catch(() => {});

      setTimeout(() => setState("result"), 2500);
    }
  }

  function handlePrevious() {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1);
  }

  function handleRestart() {
    setState("landing");
    setCurrentQuestion(0);
    setAnswers({});
  }

  return (
    <AnimatePresence mode="wait">
      {state === "landing" && (
        <motion.div key="landing" {...pageTransition}>
          <QuizLanding onStart={handleStart} />
        </motion.div>
      )}

      {state === "questions" && (
        <motion.div key={`q-${currentQuestion}`} {...pageTransition}>
          <QuizQuestion
            question={QUIZ_QUESTIONS[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={QUIZ_QUESTIONS.length}
            selectedScore={answers[QUIZ_QUESTIONS[currentQuestion].id]}
            onAnswer={handleAnswer}
            onPrevious={handlePrevious}
            canGoBack={currentQuestion > 0}
          />
        </motion.div>
      )}

      {state === "calculating" && (
        <motion.div
          key="calculating"
          className="min-h-screen flex flex-col items-center justify-center text-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.p
            className="font-display text-[clamp(2rem,6vw,5rem)] tracking-tighter text-white"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            CALCUL EN COURS...
          </motion.p>
          <div className="mt-8 w-48 h-1 bg-[#1F1F1F] overflow-hidden">
            <motion.div
              className="h-full bg-[#22C55E]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}

      {state === "result" && (
        <motion.div key="result" {...pageTransition}>
          <QuizResult
            totalScore={totalScore}
            answers={answers}
            onRestart={handleRestart}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};
