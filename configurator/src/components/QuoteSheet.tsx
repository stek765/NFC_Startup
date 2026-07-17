import { useEffect, useState } from 'react';
import { BASE_COLORS, FONTS, PRINT_COLORS, SHAPES, SIZES } from '../catalog';
import { submitQuote } from '../lib/api';
import type { PlaqueConfig } from '../types';

type Status = 'idle' | 'sending' | 'error' | 'done';

export default function QuoteSheet({
  open, onClose, config, price,
}: {
  open: boolean;
  onClose: () => void;
  config: PlaqueConfig;
  price: number;
}) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const shape = SHAPES.find((s) => s.id === config.shape)!;
  const canSend = name.trim().length > 0 && contact.trim().length > 0 && status !== 'sending';

  async function send() {
    setStatus('sending');
    const ok = await submitQuote({
      restaurant_name: name.trim(),
      contact: contact.trim(),
      notes: notes.trim(),
      config,
      price,
      logo: config.logo,
    });
    setStatus(ok ? 'done' : 'error');
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-text/40 lg:items-center" onClick={onClose}>
      <div
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-2xl bg-surface p-6 lg:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {status === 'done' ? (
          <div>
            <h2 className="text-2xl font-bold">Richiesta inviata ✓</h2>
            <p className="mt-2 text-sm text-muted">Ti ricontattiamo entro 24 ore con il preventivo definitivo.</p>
            <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Forma</dt><dd>{shape.label}, taglia {config.size.toUpperCase()}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Colori</dt><dd>{BASE_COLORS.find((c) => c.id === config.baseColor)!.label} / stampa {PRINT_COLORS.find((c) => c.id === config.printColor)!.label}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Font</dt><dd>{FONTS.find((f) => f.id === config.font)!.label}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Extra</dt><dd>{[config.qr ? 'QR' : null, config.logo ? 'Logo' : null].filter(Boolean).join(', ') || 'nessuno'}</dd></div>
              <div className="flex justify-between font-mono font-semibold"><dt>Totale stimato</dt><dd>€{price}</dd></div>
            </dl>
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                onClose();
              }}
              className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-ink"
            >
              Chiudi
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold">Richiedi il preventivo</h2>
            <p className="mt-1 text-sm text-muted">
              Nessun pagamento ora: ti ricontattiamo noi per confermare dettagli e stampa. Totale stimato:{' '}
              <span className="font-mono font-semibold text-text">€{price}</span>
            </p>
            <div className="mt-5 flex flex-col gap-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Nome del locale *</span>
                <input type="text" value={name} maxLength={120} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base outline-none focus:border-accent" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Telefono o email *</span>
                <input type="text" value={contact} maxLength={120} onChange={(e) => setContact(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base outline-none focus:border-accent" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Note (quantità, richieste particolari…)</span>
                <textarea value={notes} maxLength={500} rows={3} onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-base outline-none focus:border-accent" />
              </label>
            </div>
            {status === 'error' && (
              <p className="mt-3 text-sm font-medium text-accent">Invio non riuscito. La tua targhetta è salva: riprova.</p>
            )}
            <button
              type="button"
              disabled={!canSend}
              onClick={send}
              className="mt-5 w-full rounded-full bg-accent py-3 text-sm font-semibold text-accent-ink disabled:opacity-40"
            >
              {status === 'sending' ? 'Invio…' : status === 'error' ? 'Riprova' : 'Invia richiesta'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
