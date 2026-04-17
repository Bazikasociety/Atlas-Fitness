import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formate un prix en euros */
export function formatPrice(amountInCents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amountInCents / 100);
}

/** Formate une date en français */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/** Calcule le temps de lecture estimé */
export function readingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200); // 200 mots/min en moyenne
}

/** Génère un slug depuis un titre */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
