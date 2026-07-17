export default function PriceBar({ price, onQuote }: { price: number; onQuote: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur lg:left-auto lg:w-[440px]">
      <div className="flex items-center justify-between gap-4 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Totale stimato</p>
          <p className="font-mono text-2xl font-semibold">
            <span key={price} className="price-pop">€{price}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onQuote}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink"
        >
          Richiedi preventivo
        </button>
      </div>
    </div>
  );
}
