"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BookHeart, NotebookPen, Search } from "lucide-react";
import {
  type Entry,
  countDays,
  searchEntries,
  toDateKey,
} from "@/lib/diario";
import { EntryCard } from "@/components/EntryCard";
import { EntryEditor } from "@/components/EntryEditor";

const STORAGE_KEY = "diario-online:v1";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [query, setQuery] = useState("");
  const [todayKey, setTodayKey] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);

  // Carrega as entradas salvas e define a data de hoje.
  useEffect(() => {
    setTodayKey(toDateKey(new Date()));
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      /* localStorage indisponível — começa vazio */
    }
    setHydrated(true);
  }, []);

  // Persiste a cada mudança, depois de hidratar.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      /* cota cheia / modo privado */
    }
  }, [entries, hydrated]);

  const visible = useMemo(() => searchEntries(entries, query), [entries, query]);
  const days = useMemo(() => countDays(entries), [entries]);

  function openNew() {
    setEditing(null);
    setEditorOpen(true);
  }

  function openEdit(entry: Entry) {
    setEditing(entry);
    setEditorOpen(true);
  }

  function saveEntry(data: Omit<Entry, "id" | "createdAt">, id?: string) {
    setEntries((prev) =>
      id
        ? prev.map((e) => (e.id === id ? { ...e, ...data } : e))
        : [...prev, { ...data, id: crypto.randomUUID(), createdAt: Date.now() }],
    );
    setEditorOpen(false);
  }

  function deleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setEditorOpen(false);
  }

  if (!hydrated) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-5 px-4 py-8 pb-28">
      {/* Cabeçalho */}
      <header>
        <div className="flex items-center gap-2">
          <BookHeart size={26} style={{ color: "var(--color-accent)" }} />
          <h1 className="font-serif text-2xl font-bold tracking-tight">Meu Diário</h1>
        </div>
        {entries.length > 0 && (
          <p className="mt-1 text-sm text-ink/50">
            {entries.length} {entries.length === 1 ? "entrada" : "entradas"} em {days}{" "}
            {days === 1 ? "dia" : "dias"}
          </p>
        )}
      </header>

      {/* Busca */}
      {entries.length > 0 && (
        <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white/60 px-4">
          <Search size={18} className="text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar no diário..."
            className="w-full bg-transparent py-3 text-base outline-none placeholder:text-ink/40"
          />
        </div>
      )}

      {/* Entradas */}
      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-ink/40">
          <NotebookPen size={30} strokeWidth={1.5} />
          <p className="text-sm">
            {entries.length === 0
              ? "Seu diário está em branco. Que tal escrever sobre hoje?"
              : "Nenhuma entrada encontrada pra essa busca."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {visible.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onClick={() => openEdit(entry)} />
            ))}
          </AnimatePresence>
        </ul>
      )}

      {/* Botão flutuante */}
      <button
        onClick={openNew}
        aria-label="Nova entrada"
        className="fixed bottom-6 left-1/2 z-30 flex h-14 -translate-x-1/2 items-center gap-2 rounded-full px-6 font-bold text-white shadow-xl shadow-amber-700/25 transition active:scale-95"
        style={{ backgroundColor: "var(--color-accent)" }}
      >
        <NotebookPen size={20} /> Escrever
      </button>

      <EntryEditor
        open={editorOpen}
        defaultDate={todayKey}
        editing={editing}
        onClose={() => setEditorOpen(false)}
        onSave={saveEntry}
        onDelete={deleteEntry}
      />
    </main>
  );
}
