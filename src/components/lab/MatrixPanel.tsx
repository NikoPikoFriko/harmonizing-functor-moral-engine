import { VALUE_META } from "@/lib/moral/content";
import type { ValueKey, ValueMatrix } from "@/lib/moral/types";
import { Slider } from "@/components/ui/slider";
import { matrixSummary } from "@/lib/moral/engines";

export function MatrixPanel({
  matrix,
  onChange,
  locked,
}: {
  matrix: ValueMatrix;
  onChange: (key: ValueKey, value: number) => void;
  locked?: boolean;
}) {
  const keys = Object.keys(VALUE_META) as ValueKey[];

  return (
    <div className="panel p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Personal Value Matrix</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Explicit weights. Self-awareness before the next decision. Not what others want.
          </p>
        </div>
        <p className="text-xs text-[var(--color-subtle)]">{matrixSummary(matrix)}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {keys.map((key) => {
          const meta = VALUE_META[key];
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium text-[var(--color-fg)]">
                  {meta.label}
                </label>
                <span className="tabular text-sm text-[var(--color-muted)]">
                  {matrix[key]}
                </span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[matrix[key]]}
                disabled={locked}
                onValueChange={(v) => onChange(key, v[0] ?? 0)}
              />
              <p className="text-xs text-[var(--color-subtle)]">{meta.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-6 gap-1.5">
        {keys.map((key) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-[var(--color-elevated)]"
              style={{ height: 64 }}
              title={VALUE_META[key].label}
            >
              <div
                className="w-full rounded-sm transition-all duration-200"
                style={{
                  height: `${matrix[key]}%`,
                  marginTop: `${100 - matrix[key]}%`,
                  background: VALUE_META[key].color,
                  opacity: 0.85,
                }}
              />
            </div>
            <span className="text-[10px] text-[var(--color-subtle)]">
              {VALUE_META[key].label.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
