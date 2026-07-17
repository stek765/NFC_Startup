import type { ReactNode } from 'react';

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-border py-6 first:border-t-0">
      <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{title}</h2>
      {children}
    </section>
  );
}

function Delta({ value }: { value: number }) {
  if (value <= 0) return null;
  return <span className="font-mono text-xs opacity-70">+€{value}</span>;
}

export function Chips({
  options, value, onChange,
}: {
  options: { id: string; label: string; priceDelta?: number }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active ? 'border-accent bg-accent text-accent-ink' : 'border-border bg-surface text-text'
            }`}
          >
            {opt.label}
            <Delta value={opt.priceDelta ?? 0} />
          </button>
        );
      })}
    </div>
  );
}

export function Swatches({
  options, value, onChange, isDisabled,
}: {
  options: { id: string; label: string; hex: string; priceDelta: number }[];
  value: string;
  onChange: (id: string) => void;
  isDisabled?: (id: string) => boolean;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const active = opt.id === value;
        const disabled = isDisabled?.(opt.id) ?? false;
        return (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            title={disabled ? 'Poco leggibile su questo colore di targhetta' : opt.label}
            className={`flex flex-col items-center gap-1.5 ${disabled ? 'opacity-30' : ''}`}
          >
            <span
              className={`h-10 w-10 rounded-full border ${active ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg' : 'border-border'}`}
              style={{ backgroundColor: opt.hex }}
            />
            <span className="text-xs text-muted">
              {opt.label} <Delta value={opt.priceDelta} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function Field({
  label, value, onChange, maxLength, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {/* text-base obbligatorio: sotto 16px iOS zooma al focus */}
      <input
        type="text"
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base outline-none focus:border-accent"
      />
    </label>
  );
}

export function Toggle({
  label, delta, value, onChange,
}: {
  label: string;
  delta: number;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button type="button" onClick={() => onChange(!value)} className="flex w-full items-center justify-between py-1">
      <span className="flex items-center gap-2 text-sm font-medium">
        {label} <Delta value={delta} />
      </span>
      <span className={`h-7 w-12 rounded-full p-1 transition-colors ${value ? 'bg-accent' : 'bg-border'}`}>
        <span className={`block h-5 w-5 rounded-full bg-surface transition-transform ${value ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  );
}
