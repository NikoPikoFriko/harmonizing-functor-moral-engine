import { TURN_META } from "@/lib/moral/content";
import type { TurnId } from "@/lib/moral/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TurnChrome({
  turn,
  onJump,
}: {
  turn: TurnId;
  onJump: (t: TurnId) => void;
}) {
  const meta = TURN_META[turn];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="accent">Turn {turn} / 10</Badge>
        <Badge variant="muted">{meta.version}</Badge>
        <Badge variant="default">{meta.certainty} certainty</Badge>
      </div>
      <div>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{meta.title}</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">{meta.engine}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--color-subtle)]">
          {meta.blurb}
        </p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(Object.keys(TURN_META) as unknown as TurnId[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onJump(t)}
            className={cn(
              "h-2.5 min-w-8 flex-1 rounded-full transition-colors",
              t === turn
                ? "bg-[var(--color-primary)]"
                : t < turn
                  ? "bg-[var(--color-primary)]/40"
                  : "bg-[var(--color-elevated)]",
            )}
            aria-label={`Jump to turn ${t}`}
          />
        ))}
      </div>
    </div>
  );
}
