import type { MatchStatus, OverallStatus } from "../types";

export const statusLabels: Record<MatchStatus, string> = {
  enough: "Используй это",
  use_differently: "Используй иначе",
  not_suitable: "Не подходит",
  missing: "Нужно докупить",
  needs_confirmation: "Уточнить данные"
};

export const overallLabels: Record<OverallStatus, string> = {
  ready_now: "Можно повторить сейчас",
  needs_confirmation: "Нужно уточнить детали",
  shopping_gaps: "Есть пробелы в косметичке"
};

export const difficultyLabels: Record<string, string> = {
  beginner: "легко",
  intermediate: "средне",
  advanced: "сложно"
};

export const occasionLabels: Record<string, string> = {
  daily: "каждый день",
  evening: "вечер",
  work: "работа",
  "date night": "вечернее свидание"
};

export const categoryLabels: Record<string, string> = {
  primer: "праймер",
  foundation: "тон",
  skin_tint: "тинт для кожи",
  blush: "румяна",
  eyeshadow: "тени",
  eyeliner: "карандаш",
  mascara: "тушь",
  highlighter: "хайлайтер",
  lip_gloss: "блеск",
  lipstick: "помада",
  lip_tint: "тинт для губ",
  concealer: "консилер",
  bronzer: "бронзер",
  powder: "пудра",
  eyebrow_pencil: "карандаш для бровей",
  brow_gel: "гель для бровей",
  lip_balm: "бальзам"
};

export function categoryLabel(value: string): string {
  return categoryLabels[value] ?? value;
}

export function areaForCategory(category: string): string {
  if (["primer", "foundation", "skin_tint", "concealer", "powder"].includes(category)) {
    return "Кожа";
  }
  if (["blush", "bronzer", "highlighter"].includes(category)) {
    return "Щеки";
  }
  if (["eyeshadow", "eyeliner", "mascara"].includes(category)) {
    return "Глаза";
  }
  if (["eyebrow_pencil", "brow_gel"].includes(category)) {
    return "Брови";
  }
  if (["lip_gloss", "lipstick", "lip_tint", "lip_balm"].includes(category)) {
    return "Губы";
  }
  return "Другое";
}
