"use client";

import { initials } from "@/lib/utils";

/**
 * Live "also viewing" presence.
 *
 * In demo mode this shows realistic active judges. To go live, replace `viewers`
 * with a Supabase Realtime presence channel:
 *
 *   const channel = supabase.channel(`submission:${submissionId}`)
 *   channel.on("presence", { event: "sync" }, () => setViewers(channel.presenceState()))
 *   channel.subscribe(async (s) => { if (s === "SUBSCRIBED") await channel.track({ name }) })
 *
 * The structure here (a list of named viewers + your own identity) maps 1:1 onto
 * presence state, so the UI doesn't change when the data source does.
 */

const AVATAR_TINTS = ["bg-ink", "bg-accent"];

export function RealtimeJudgePresence({
  viewers = ["Alex Chen", "Maya Patel"],
}: {
  viewers?: string[];
}) {
  if (viewers.length === 0) return null;
  const first = viewers.map((v) => v.split(" ")[0]);
  const text =
    viewers.length === 1
      ? `${first[0]} is also viewing`
      : `${first.slice(0, -1).join(", ")} & ${first[first.length - 1]} also viewing`;

  return (
    <div className="mb-[22px] flex items-center gap-2.5">
      <div className="flex">
        {viewers.slice(0, 3).map((name, i) => (
          <span
            key={name}
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-raised text-[10px] font-semibold text-canvas ${AVATAR_TINTS[i % AVATAR_TINTS.length]}`}
            style={{ marginLeft: i === 0 ? 0 : -7 }}
            title={name}
          >
            {initials(name)}
          </span>
        ))}
      </div>
      <span className="text-[12.5px] text-dim">{text}</span>
    </div>
  );
}
