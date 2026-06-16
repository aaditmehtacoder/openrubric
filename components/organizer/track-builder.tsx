"use client";

import { useState } from "react";

export function TrackBuilder({
  tracks,
  onChange,
}: {
  tracks: string[];
  onChange: (next: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");

  function add() {
    const name = value.trim();
    if (name && !tracks.includes(name)) onChange([...tracks, name]);
    setValue("");
    setAdding(false);
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {tracks.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-raised px-3.5 py-2 text-[13.5px] font-medium"
        >
          {t}
          <button
            type="button"
            onClick={() => onChange(tracks.filter((x) => x !== t))}
            className="text-[#C9C4BA] transition-colors hover:text-signal-high"
            aria-label={`Remove ${t}`}
          >
            ×
          </button>
        </span>
      ))}

      {adding ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-accent bg-accent-soft px-2 py-1">
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add();
              if (e.key === "Escape") setAdding(false);
            }}
            onBlur={add}
            placeholder="Track name"
            className="w-28 border-none bg-transparent px-1.5 text-[13.5px] outline-none"
            aria-label="New track name"
          />
        </span>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="rounded-full border border-dashed border-[#C7D3F2] bg-accent-soft px-3.5 py-2 text-[13.5px] font-semibold text-accent"
        >
          + Add track
        </button>
      )}
    </div>
  );
}
