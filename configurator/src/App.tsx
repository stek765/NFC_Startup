import { useState } from 'react';
import LogoUpload from './components/LogoUpload';
import Preview from './components/Preview';
import PriceBar from './components/PriceBar';
import QuoteSheet from './components/QuoteSheet';
import { Chips, Field, Section, Swatches, Toggle } from './components/controls';
import { BASE_COLORS, FONTS, LOGO_PRICE, MAX_TEXT_LEN, PRINT_COLORS, QR_PRICE, SHAPES, SIZES } from './catalog';
import { computePrice } from './lib/price';
import { isReadable } from './lib/readability';
import { useConfig } from './state/useConfig';
import type { ShapeId, SizeId } from './types';

export default function App() {
  const { config, set, setBaseColor } = useConfig();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const baseHex = BASE_COLORS.find((c) => c.id === config.baseColor)!.hex;
  const price = computePrice(config);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_440px]">
      <div className="sticky top-0 z-10 flex h-[44vh] items-center justify-center bg-stage lg:h-screen">
        <Preview config={config} />
      </div>

      <main className="px-5 pb-44 pt-8 lg:h-screen lg:overflow-y-auto lg:px-8">
        <header className="pb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">NFC Smart</p>
          <h1 className="mt-2 text-3xl font-bold">Componi la tua targhetta</h1>
          <p className="mt-1 text-sm text-muted">
            Ogni scelta aggiorna il prezzo. Il tag NFC è sempre incluso, invisibile nella stampa.
          </p>
        </header>

        <Section title="Forma">
          <Chips
            options={SHAPES.map((s) => ({ id: s.id, label: s.label, priceDelta: s.basePrice - SHAPES[0].basePrice }))}
            value={config.shape}
            onChange={(id) => set('shape', id as ShapeId)}
          />
        </Section>

        <Section title="Dimensione">
          <Chips
            options={SIZES.map((s) => ({ id: s.id, label: s.label, priceDelta: s.priceDelta }))}
            value={config.size}
            onChange={(id) => set('size', id as SizeId)}
          />
        </Section>

        <Section title="Colore targhetta">
          <Swatches options={BASE_COLORS} value={config.baseColor} onChange={setBaseColor} />
        </Section>

        <Section title="Colore stampa">
          <Swatches
            options={PRINT_COLORS}
            value={config.printColor}
            onChange={(id) => set('printColor', id)}
            isDisabled={(id) => !isReadable(baseHex, PRINT_COLORS.find((c) => c.id === id)!.hex)}
          />
        </Section>

        <Section title="Testi">
          <div className="flex flex-col gap-4">
            <Field label="Riga in alto" value={config.textTop} onChange={(v) => set('textTop', v)} maxLength={MAX_TEXT_LEN} placeholder="Welcome" />
            <Field label="Riga in basso" value={config.textBottom} onChange={(v) => set('textBottom', v)} maxLength={MAX_TEXT_LEN} placeholder="Enjoy" />
          </div>
        </Section>

        <Section title="Font">
          <div className="flex flex-wrap gap-2">
            {FONTS.map((f) => {
              const active = f.id === config.font;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => set('font', f.id)}
                  className={`rounded-full border px-4 py-2 text-lg transition-colors ${
                    active ? 'border-accent bg-accent text-accent-ink' : 'border-border bg-surface'
                  }`}
                  style={{ fontFamily: f.family }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </Section>

        <Section title={`Logo (+€${LOGO_PRICE})`}>
          <LogoUpload value={config.logo} onChange={(v) => set('logo', v)} />
        </Section>

        <Section title="QR code">
          <Toggle label="Aggiungi il QR accanto all'NFC" delta={QR_PRICE} value={config.qr} onChange={(v) => set('qr', v)} />
          <p className="mt-2 text-xs text-muted">Per chi preferisce inquadrare invece di appoggiare il telefono.</p>
        </Section>
      </main>

      <PriceBar price={price} onQuote={() => setQuoteOpen(true)} />
      <QuoteSheet open={quoteOpen} onClose={() => setQuoteOpen(false)} config={config} price={price} />
    </div>
  );
}
