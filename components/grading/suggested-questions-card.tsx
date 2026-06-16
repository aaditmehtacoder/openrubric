export function SuggestedQuestionsCard({ questions }: { questions: string[] }) {
  return (
    <div className="mb-4 rounded-[14px] border border-line bg-surface p-5">
      <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">
        Suggested questions
      </div>
      <div className="flex flex-col gap-2.5">
        {questions.map((q) => (
          <div key={q} className="flex items-baseline gap-2.5">
            <span className="font-mono text-[12px] text-accent">→</span>
            <span className="text-[13.5px] text-ink">{q}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
