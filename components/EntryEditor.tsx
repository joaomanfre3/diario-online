"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, X } from "lucide-react";
import { type Entry, type MoodId, MOODS, longDate } from "@/lib/diario";

interface EntryEditorProps {
  open: boolean;
  /** Data base "AAAA-MM-DD" pra novas entradas. */
  defaultDate: string;
  editing: Entry | null;
  onClose: () => void;
  onSave: (data: Omit<Entry, "id" | "createdAt">, id?: string) => void;
  onDelete: (id: string) => void;
}

export function EntryEditor({
  open,
  defaultDate,
  editing,
  onClose,
  onSave,
  onDelete,
}: EntryEditorProps) {
  const [date, setDate] = useState(defaultDate);
  const [mood, setMood] = useState<MoodId>("feliz");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Preenche (edição) ou limpa (nova) ao abrir.
  useEffect(() => {
    if (!open) return;
    setDate(editing?.date ?? defaultDate);
    setMood(editing?.mood ?? "feliz");
    setTitle(editing?.title ?? "");
    setContent(editing?.content ?? "");
  }, [open, editing, defaultDate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    onSave({ date, mood, title: title.trim(), content: content.trim() }, editing?.id);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[90dvh] max-w-lg flex-col rounded-t-3xl bg-paper p-5 pb-8 shadow-2xl"
            style={{ backgroundColor: "var(--color-paper)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold">
                {editing ? "Editar entrada" : "Nova entrada"}
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 transition hover:bg-black/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Data */}
            <label className="mb-3 flex items-center justify-between rounded-xl bg-black/[0.03] px-4 py-2.5">
              <span className="text-sm font-medium text-ink/60">Data</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-base outline-none"
              />
            </label>

            {/* Humor do dia */}
            <div className="mb-3">
              <p className="mb-2 text-sm font-medium text-ink/60">Como você está?</p>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((m) => {
                  const active = m.id === mood;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                        active ? "text-white" : "bg-black/5 text-ink/70 hover:bg-black/10"
                      }`}
                      style={active ? { backgroundColor: m.color } : undefined}
                    >
                      <span aria-hidden>{m.emoji}</span>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Título */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título (opcional)"
              maxLength={80}
              className="mb-2 w-full rounded-xl border border-black/10 bg-white/60 px-4 py-3 font-serif text-lg outline-none transition focus:border-accent"
            />

            {/* Conteúdo */}
            <textarea
              autoFocus={!editing}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escreva sobre o seu dia..."
              rows={6}
              className="mb-4 w-full flex-1 resize-none rounded-xl border border-black/10 bg-white/60 px-4 py-3 text-base leading-relaxed outline-none transition focus:border-accent"
            />

            {/* Ações */}
            <div className="flex gap-2">
              {editing && (
                <button
                  type="button"
                  onClick={() => onDelete(editing.id)}
                  aria-label="Excluir entrada"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                >
                  <Trash2 size={18} />
                </button>
              )}
              <button
                type="submit"
                disabled={!content.trim()}
                className="h-12 flex-1 rounded-xl text-base font-bold text-white transition hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                {editing ? "Salvar" : "Guardar no diário"}
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-ink/40">{longDate(date)}</p>
          </motion.form>
        </>
      )}
    </AnimatePresence>
  );
}
