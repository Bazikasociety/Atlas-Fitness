// Données du quiz santé Atlas Fitness
// Basé sur les recommandations OMS et données INSEE
// Chaque question vaut 2.5 points → total sur 20

export interface QuizOption {
  label: string;
  score: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  source: string;
  category: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "activity",
    question: "Combien de minutes d'activité physique modérée à intense pratiquez-vous par semaine ?",
    source: "OMS : 150 à 300 min/semaine recommandées.",
    category: "Activité physique",
    options: [
      { label: "Moins de 30 min", score: 0 },
      { label: "30 à 75 min", score: 1 },
      { label: "75 à 150 min", score: 1.75 },
      { label: "150 min ou plus", score: 2.5 },
    ],
  },
  {
    id: "sleep",
    question: "Combien d'heures dormez-vous en moyenne par nuit ?",
    source: "OMS : 7 à 9 h recommandées pour un adulte.",
    category: "Sommeil",
    options: [
      { label: "Moins de 5h", score: 0 },
      { label: "5 à 6h", score: 1 },
      { label: "6 à 7h", score: 1.75 },
      { label: "7 à 9h", score: 2.5 },
    ],
  },
  {
    id: "fruits_vegetables",
    question: "Combien de portions de fruits et légumes consommez-vous par jour ?",
    source: "OMS : au moins 5 portions/jour (≈ 400g).",
    category: "Nutrition",
    options: [
      { label: "0 à 1", score: 0 },
      { label: "2 à 3", score: 1.25 },
      { label: "4", score: 1.75 },
      { label: "5 ou plus", score: 2.5 },
    ],
  },
  {
    id: "water",
    question: "Combien de verres d'eau buvez-vous par jour ?",
    source: "ANSES : 1,5 à 2L d'eau/jour recommandés.",
    category: "Hydratation",
    options: [
      { label: "Moins de 3", score: 0 },
      { label: "3 à 5", score: 1 },
      { label: "6 à 7", score: 1.75 },
      { label: "8 ou plus", score: 2.5 },
    ],
  },
  {
    id: "sedentary",
    question: "Combien d'heures par jour restez-vous assis (travail + loisirs) ?",
    source: "INSEE : la sédentarité prolongée (>7h/j) augmente le risque de maladies chroniques.",
    category: "Sédentarité",
    options: [
      { label: "Plus de 10h", score: 0 },
      { label: "7 à 10h", score: 1 },
      { label: "4 à 7h", score: 1.75 },
      { label: "Moins de 4h", score: 2.5 },
    ],
  },
  {
    id: "stress",
    question: "À quelle fréquence vous sentez-vous stressé·e ?",
    source: "Santé publique France : le stress chronique affecte la santé cardiovasculaire.",
    category: "Stress",
    options: [
      { label: "En permanence", score: 0 },
      { label: "Souvent", score: 1 },
      { label: "Parfois", score: 1.75 },
      { label: "Rarement", score: 2.5 },
    ],
  },
  {
    id: "smoking_alcohol",
    question: "Votre consommation de tabac / alcool ?",
    source: "OMS : pas de consommation sans risque. Max 10 verres/semaine si alcool.",
    category: "Toxiques",
    options: [
      { label: "Tabac quotidien + alcool régulier", score: 0 },
      { label: "L'un des deux régulièrement", score: 1 },
      { label: "Consommation occasionnelle", score: 1.75 },
      { label: "Aucune / très rare", score: 2.5 },
    ],
  },
  {
    id: "processed_food",
    question: "À quelle fréquence consommez-vous des aliments ultra-transformés ?",
    source: "INSERM : >4 portions/jour d'ultra-transformés = +62% risque mortalité.",
    category: "Qualité alimentaire",
    options: [
      { label: "Tous les jours", score: 0 },
      { label: "Plusieurs fois/semaine", score: 1 },
      { label: "1 fois/semaine", score: 1.75 },
      { label: "Rarement / jamais", score: 2.5 },
    ],
  },
];

export interface ScoreResult {
  label: string;
  description: string;
  color: string;
}

/** Interprète le score total et retourne le libellé + description */
export function interpretScore(score: number): ScoreResult {
  if (score <= 7) {
    return {
      label: "SIGNAL D'ALARME",
      description:
        "Vos habitudes demandent une vraie remise en question. Atlas Fitness peut vous accompagner.",
      color: "#EF4444",
    };
  } else if (score <= 12) {
    return {
      label: "À AMÉLIORER",
      description: "Plusieurs leviers identifiés. Du potentiel à débloquer.",
      color: "#F97316",
    };
  } else if (score <= 16) {
    return {
      label: "CORRECT",
      description: "Vous êtes sur la bonne voie. On peut aller plus loin ensemble.",
      color: "#EAB308",
    };
  } else {
    return {
      label: "EXCELLENT",
      description:
        "Bravo. Vos habitudes sont solides. L'optimisation est à votre portée.",
      color: "#22C55E",
    };
  }
}

/** Génère 3 conseils personnalisés depuis les 3 scores les plus bas */
export function getPersonalizedAdvice(
  answers: Record<string, number>
): string[] {
  const adviceMap: Record<string, string> = {
    activity:
      "Commencez par 30 min de marche rapide 3x/semaine — c'est suffisant pour déclencher des adaptations cardiovasculaires.",
    sleep:
      "Le sommeil est votre récupération n°1. Couchez-vous 30 min plus tôt chaque semaine jusqu'à atteindre 7h.",
    fruits_vegetables:
      "Ajoutez une portion de légumes à chaque repas. La règle simple : remplissez la moitié de votre assiette de végétaux.",
    water:
      "Hydratez-vous avant d'avoir soif. Posez une grande gourde sur votre bureau et videz-la avant midi.",
    sedentary:
      "Levez-vous toutes les heures pendant 5 minutes. Un minuteur suffit pour briser la sédentarité.",
    stress:
      "10 minutes de respiration profonde le matin réduisent le cortisol de 20%. Simple, prouvé, gratuit.",
    smoking_alcohol:
      "Chaque consommation réduit votre récupération et vos gains musculaires. Un sevrage progressif change tout.",
    processed_food:
      "Cuisinez en batch le dimanche. 3h de préparation = des repas sains pour toute la semaine.",
  };

  const sorted = Object.entries(answers)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)
    .map(([id]) => adviceMap[id] ?? "");

  return sorted.filter(Boolean);
}
