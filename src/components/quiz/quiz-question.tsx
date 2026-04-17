"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import type { QuizQuestion as QuizQuestionType } from "@/lib/quiz-data";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  totalQuestions: number;
  selectedScore: number | undefined;
  onAnswer: (questionId: string, score: number) => void;
  onPrevious: () => void;
  canGoBack: boolean;
}

export function QuizQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedScore,
  onAnswer,
  onPrevious,
  canGoBack,
}: QuizQuestionProps) {
  const progress = ((questionIndex) / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex flex-col px-6 py-24">
      {/* Progress bar */}
      <div className="max-w-2xl mx-auto w-full mb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="font-body text-xs uppercase tracking-widest text-[#A1A1AA]">
            {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="font-body text-xs uppercase tracking-widest text-[#22C55E]">
            {question.category}
          </span>
        </div>
        <div className="h-px bg-[#1F1F1F] w-full overflow-hidden">
          <motion.div
            className="h-full bg-[#22C55E]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-[clamp(1.8rem,4vw,3.5rem)] leading-tight tracking-tight text-white mb-3">
            {question.question}
          </h2>
          <p className="font-body text-xs text-[#A1A1AA]/60 mb-10 italic">
            Source : {question.source}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isSelected = selectedScore === option.score;
              return (
                <motion.button
                  key={option.label}
                  onClick={() => onAnswer(question.id, option.score)}
                  className={`w-full text-left p-5 border transition-all duration-200 group ${
                    isSelected
                      ? "border-[#22C55E] bg-[#22C55E]/10 text-white"
                      : "border-[#1F1F1F] text-[#A1A1AA] hover:border-[#22C55E]/50 hover:text-white hover:bg-[#1F1F1F]"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-[#22C55E] bg-[#22C55E]" : "border-[#1F1F1F] group-hover:border-[#22C55E]/50"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-black" />
                      )}
                    </span>
                    <span className="font-body text-sm">{option.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Navigation précédent */}
      {canGoBack && (
        <div className="max-w-2xl mx-auto w-full mt-8">
          <button
            onClick={onPrevious}
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-white transition-colors"
          >
            <ChevronLeft size={14} />
            Question précédente
          </button>
        </div>
      )}
    </div>
  );
}
