"use client";

import { motion } from "framer-motion";
import { type Entry, longDate, moodOf } from "@/lib/diario";

interface EntryCardProps {
  entry: Entry;
  onClick: () => void;
}

export function EntryCard({ entry, onClick }: EntryCardProps) {
  const mood = moodOf(entry.mood);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
    >
      <button
        onClick={onClick}
        className="relative flex w-full flex-col gap-1 overflow-hidden rounded-2xl border border-black/5 bg-white/70 p-4 text-left shadow-sm transition hover:shadow-md"
      >
        {/* Faixa colorida do humor */}
        <span
          className="absolute inset-y-0 left-0 w-1.5"
          style={{ backgroundColor: mood.color }}
        />

        <div className="flex items-center justify-between gap-2 pl-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink/40">
            {longDate(entry.date)}
          </span>
          <span className="text-lg" aria-label={mood.label}>
            {mood.emoji}
          </span>
        </div>

        {entry.title && (
          <h3 className="pl-2 font-serif text-lg font-semibold leading-snug">
            {entry.title}
          </h3>
        )}

        <p className="line-clamp-3 pl-2 text-sm leading-relaxed text-ink/70">
          {entry.content}
        </p>
      </button>
    </motion.li>
  );
}
