// Tipos, humores e utilidades do diário — lógica pura, sem React.

export type MoodId = "otimo" | "feliz" | "neutro" | "cansado" | "triste" | "irritado";

export interface Mood {
  id: MoodId;
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: Mood[] = [
  { id: "otimo", emoji: "😄", label: "Ótimo", color: "#22c55e" },
  { id: "feliz", emoji: "🙂", label: "Feliz", color: "#84cc16" },
  { id: "neutro", emoji: "😐", label: "Neutro", color: "#a8a29e" },
  { id: "cansado", emoji: "😮‍💨", label: "Cansado", color: "#f59e0b" },
  { id: "triste", emoji: "😢", label: "Triste", color: "#3b82f6" },
  { id: "irritado", emoji: "😠", label: "Irritado", color: "#ef4444" },
];

export function moodOf(id: MoodId): Mood {
  return MOODS.find((m) => m.id === id) ?? MOODS[2];
}

export interface Entry {
  id: string;
  /** Data "AAAA-MM-DD". */
  date: string;
  mood: MoodId;
  title: string;
  content: string;
  /** Momento de criação, pra desempatar entradas do mesmo dia. */
  createdAt: number;
}

export const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const WEEKDAYS = [
  "domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado",
];

/** Chave "AAAA-MM-DD" de um Date no horário local. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Data por extenso, ex.: "segunda, 1 de junho de 2026". */
export function longDate(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${WEEKDAYS[date.getDay()]}, ${d} de ${MONTHS[m - 1]} de ${y}`;
}

/** Remove acentos pra busca tolerante. */
function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Filtra as entradas por um termo (título ou conteúdo) e ordena recentes primeiro. */
export function searchEntries(entries: Entry[], term: string): Entry[] {
  const q = normalize(term.trim());
  const filtered = q
    ? entries.filter((e) => normalize(`${e.title} ${e.content}`).includes(q))
    : entries;

  return [...filtered].sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.createdAt - a.createdAt;
  });
}

/** Conta dias distintos com pelo menos uma entrada. */
export function countDays(entries: Entry[]): number {
  return new Set(entries.map((e) => e.date)).size;
}
