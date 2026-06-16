"use client";

/**
 * Client-side demo store.
 *
 * Holds the CURRENT judge's mutable scoring state across the whole app so the judge
 * dashboard, grading workspace, and (read-only) organizer views stay in sync as you
 * score. Seeded from lib/demo-data; lightly persisted to localStorage so a refresh
 * keeps your work. This is the seam a real Supabase backend slots into — swap these
 * setters for `judge_scores` upserts and the UI is unchanged.
 *
 * Autosave is a realistic state machine: any edit → "saving" → (850ms) → "saved".
 * Each judge keeps an independent record; nothing here ever overwrites another judge.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SEED_COMMENTS, SEED_PRESENTATION, SEED_SCORES } from "@/lib/demo-data";
import type { AutosaveStatus, PresentationMap, ScoreMap } from "@/lib/types";

interface DemoContextValue {
  autosave: AutosaveStatus;
  scoresFor: (submissionId: string) => ScoreMap;
  presentationFor: (submissionId: string) => PresentationMap;
  commentFor: (submissionId: string) => string;
  setScore: (submissionId: string, criterionId: string, value: number) => void;
  setPresentation: (submissionId: string, key: string, value: number) => void;
  setComment: (submissionId: string, text: string) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);
const STORAGE_KEY = "openrubric-demo-v1";

interface Persisted {
  scores: Record<string, ScoreMap>;
  presentation: Record<string, PresentationMap>;
  comments: Record<string, string>;
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [scores, setScores] = useState<Record<string, ScoreMap>>(SEED_SCORES);
  const [presentation, setPresentation] = useState<Record<string, PresentationMap>>(SEED_PRESENTATION);
  const [comments, setComments] = useState<Record<string, string>>(SEED_COMMENTS);
  const [autosave, setAutosave] = useState<AutosaveStatus>("saved");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydrated = useRef(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted>;
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.presentation) setPresentation(parsed.presentation);
        if (parsed.comments) setComments(parsed.comments);
      }
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true;
  }, []);

  // Persist after hydration.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ scores, presentation, comments } satisfies Persisted),
      );
    } catch {
      /* storage may be unavailable */
    }
  }, [scores, presentation, comments]);

  const touchAutosave = useCallback(() => {
    setAutosave("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setAutosave("saved"), 850);
  }, []);

  useEffect(() => () => void (saveTimer.current && clearTimeout(saveTimer.current)), []);

  const setScore = useCallback(
    (submissionId: string, criterionId: string, value: number) => {
      setScores((prev) => ({
        ...prev,
        [submissionId]: { ...(prev[submissionId] ?? {}), [criterionId]: value },
      }));
      touchAutosave();
    },
    [touchAutosave],
  );

  const setPresentationValue = useCallback(
    (submissionId: string, key: string, value: number) => {
      setPresentation((prev) => ({
        ...prev,
        [submissionId]: { ...(prev[submissionId] ?? {}), [key]: value },
      }));
      touchAutosave();
    },
    [touchAutosave],
  );

  const setComment = useCallback(
    (submissionId: string, text: string) => {
      setComments((prev) => ({ ...prev, [submissionId]: text }));
      touchAutosave();
    },
    [touchAutosave],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      autosave,
      scoresFor: (id) => scores[id] ?? {},
      presentationFor: (id) => presentation[id] ?? {},
      commentFor: (id) => comments[id] ?? "",
      setScore,
      setPresentation: setPresentationValue,
      setComment,
    }),
    [autosave, scores, presentation, comments, setScore, setPresentationValue, setComment],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within <DemoProvider>");
  return ctx;
}
