import { useEffect, useRef, useState } from 'react';
import Preview, { PlaqueCaption } from './Preview';
import { BASE_COLORS, SHAPES } from '../catalog';
import type { PlaqueConfig } from '../types';

/**
 * Scena dell'anteprima: targhetta in scala MILLIMETRICA REALE con accanto la
 * sagoma di uno smartphone (71×147 mm, sempre visibile — è il paragone di
 * dimensioni), più le viste stile scheda prodotto (frontale / tre quarti /
 * profilo) rese con prospettiva CSS e uno spessore finto di ~4 mm.
 */

const PHONE_MM: [number, number] = [71, 147];
const GAP_MM = 16;
const THICKNESS_MM = 4;

type ViewId = 'front' | 'table' | 'diag' | 'landscape' | 'side';

// Pose stile still-life da scheda prodotto: rotate = posa, zoom = quanto la
// camera si avvicina, origin = perno della rotazione, dark = fondale scuro
// d'atmosfera (la vista "sul tavolo") con ombra di contatto.
interface ViewDef {
  id: ViewId;
  label: string;
  rotate: string;
  zoom: number;
  origin: string;
  dark?: boolean;
}

const VIEWS: ViewDef[] = [
  { id: 'front', label: 'Frontale', rotate: 'rotateY(0deg)', zoom: 1, origin: '50% 50%' },
  { id: 'table', label: 'Sul tavolo', rotate: 'rotateX(56deg) rotateZ(-14deg)', zoom: 1.35, origin: '50% 72%', dark: true },
  { id: 'diag', label: 'Diagonale', rotate: 'rotateZ(-20deg) rotateY(32deg) rotateX(8deg)', zoom: 1.45, origin: '50% 50%' },
  // coricata di lato, faccia inclinata verso l'alto: si vede lo spessore lungo il bordo
  { id: 'landscape', label: 'Orizzontale', rotate: 'rotateX(64deg) rotateZ(-90deg)', zoom: 1.2, origin: '50% 50%' },
  { id: 'side', label: 'Profilo', rotate: 'rotateY(72deg) rotateX(4deg)', zoom: 1.6, origin: '50% 50%' },
];

/** scurisce un #rrggbb (f < 1) — per il fianco della targhetta */
function shade(hex: string, f: number): string {
  const h = hex.replace('#', '');
  const c = (i: number) => Math.round(parseInt(h.slice(i, i + 2), 16) * f).toString(16).padStart(2, '0');
  return `#${c(0)}${c(2)}${c(4)}`;
}

const QUOTA = 'rgba(23,24,26,0.5)';

/** linee di quota stile disegno tecnico: tacca–linea–tacca + misura */
function DimLine({ from, to, axis, label }: { from: number; to: number; axis: 'x' | 'y'; label: string }) {
  const mid = (from + to) / 2;
  if (axis === 'x') {
    // quota orizzontale, disegnata sopra (y = -9)
    return (
      <g>
        <g stroke={QUOTA} strokeWidth="0.7">
          <line x1={from} y1={-5} x2={from} y2={-13} />
          <line x1={to} y1={-5} x2={to} y2={-13} />
          <line x1={from} y1={-9} x2={mid - 12} y2={-9} />
          <line x1={mid + 12} y1={-9} x2={to} y2={-9} />
        </g>
        <text x={mid} y={-7} textAnchor="middle" fontSize="5.5" fill={QUOTA} fontFamily="'IBM Plex Mono', monospace">
          {label}
        </text>
      </g>
    );
  }
  // quota verticale, disegnata a sinistra (x = -9)
  return (
    <g>
      <g stroke={QUOTA} strokeWidth="0.7">
        <line x1={-5} y1={from} x2={-13} y2={from} />
        <line x1={-5} y1={to} x2={-13} y2={to} />
        <line x1={-9} y1={from} x2={-9} y2={mid - 12} />
        <line x1={-9} y1={mid + 12} x2={-9} y2={to} />
      </g>
      <text
        x={-7}
        y={mid}
        textAnchor="middle"
        fontSize="5.5"
        fill={QUOTA}
        fontFamily="'IBM Plex Mono', monospace"
        transform={`rotate(-90 -7 ${mid})`}
      >
        {label}
      </text>
    </g>
  );
}

function PhoneSilhouette({ w, h, gap, visible }: { w: number; h: number; gap: number; visible: boolean }) {
  // viewBox esteso a sinistra e sopra per le linee di quota; il bordo inferiore
  // resta y=147 così la base del telefono è allineata a quella della targhetta.
  // quando la vista non è frontale collassa davvero (larghezza -> 0), così la
  // targhetta si ricentra invece di orbitare attorno a uno spazio vuoto
  const mLeft = 20;
  const mTop = 18;
  const fullW = w * ((71 + mLeft) / 71);
  const fullH = h * ((147 + mTop) / 147);
  return (
    <div
      aria-hidden={!visible}
      style={{
        width: visible ? fullW : 0,
        marginRight: visible ? gap : 0,
        opacity: visible ? 1 : 0,
        overflow: 'hidden',
        transition: 'width 0.5s ease, margin-right 0.5s ease, opacity 0.4s',
      }}
    >
      <svg
        viewBox={`-${mLeft} -${mTop} ${71 + mLeft} ${147 + mTop}`}
        style={{ width: fullW, height: fullH }}
        aria-label="Smartphone di misura media (71 per 147 millimetri), per confronto"
        role="img"
      >
        <rect x="1.5" y="1.5" width="68" height="144" rx="10" fill="rgba(23,24,26,0.05)" stroke="rgba(23,24,26,0.35)" strokeWidth="2" />
        <rect x="6" y="6" width="59" height="135" rx="6" fill="none" stroke="rgba(23,24,26,0.14)" strokeWidth="1.5" />
        <circle cx="35.5" cy="11" r="2" fill="rgba(23,24,26,0.3)" />
        <DimLine axis="x" from={0} to={71} label="71 mm" />
        <DimLine axis="y" from={0} to={147} label="147 mm" />
      </svg>
    </div>
  );
}

/** quote della vista orizzontale: altezza della targhetta + spessore, in px di schermo */
function LandscapeDims({ w, mmLabel, tPx }: { w: number; mmLabel: string; tPx: number }) {
  const th = Math.max(10, tPx);
  const midY = 12;
  return (
    // translateX(42) = metà degli 84px extra della quota spessore: così la
    // quota dell'altezza resta centrata esattamente sotto la targhetta
    <svg width={w + 84} height={Math.max(30, th + 12)} aria-hidden style={{ transform: 'translateX(42px)' }}>
      {/* altezza (il lato lungo, ora orizzontale) */}
      <g stroke={QUOTA} strokeWidth="1">
        <line x1={1} y1={midY - 7} x2={1} y2={midY + 7} />
        <line x1={w} y1={midY - 7} x2={w} y2={midY + 7} />
        <line x1={1} y1={midY} x2={w / 2 - 30} y2={midY} />
        <line x1={w / 2 + 30} y1={midY} x2={w} y2={midY} />
      </g>
      <text x={w / 2} y={midY + 3.5} textAnchor="middle" fontSize="10" fill={QUOTA} fontFamily="'IBM Plex Mono', monospace">
        {mmLabel}
      </text>
      {/* spessore */}
      <g stroke={QUOTA} strokeWidth="1">
        <line x1={w + 12} y1={4} x2={w + 24} y2={4} />
        <line x1={w + 12} y1={4 + th} x2={w + 24} y2={4 + th} />
        <line x1={w + 18} y1={4} x2={w + 18} y2={4 + th} />
      </g>
      <text x={w + 28} y={4 + th / 2 + 3.5} textAnchor="start" fontSize="10" fill={QUOTA} fontFamily="'IBM Plex Mono', monospace">
        {THICKNESS_MM} mm
      </text>
    </svg>
  );
}

/** selettore vista: pill testuale, leggibile anche sul fondale scuro */
function ViewPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Vista ${label}`}
      className={`rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap transition-colors ${
        active ? 'border-accent bg-accent text-accent-ink' : 'border-border bg-surface text-muted'
      }`}
    >
      {label}
    </button>
  );
}

export default function PreviewStage({ config }: { config: PlaqueConfig }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<[number, number]>([340, 360]);
  const [view, setView] = useState<ViewId>('front');

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(() => setBox([el.clientWidth, el.clientHeight]));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const shape = SHAPES.find((s) => s.id === config.shape)!;
  const base = BASE_COLORS.find((c) => c.id === config.baseColor)!;
  const [mmW, mmH] = shape.mm[config.size];
  const [bw, bh] = box;

  // px per mm: telefono + gap + targhetta devono starci, con aria attorno.
  // Su mobile (<1024) didascalia e miniature stanno in colonna sotto la coppia,
  // quindi il budget verticale per la coppia è più stretto.
  const hFactor = bw >= 1024 ? 0.74 : 0.52;
  // +20/+18: margini delle linee di quota del telefono (vedi PhoneSilhouette)
  const k = Math.min((bw * 0.72) / (PHONE_MM[0] + 20 + GAP_MM + mmW), (bh * hFactor) / Math.max(PHONE_MM[1] + 18, mmH));
  const plaqueW = mmW * k;
  const t = Math.max(3, THICKNESS_MM * k);
  const sideColor = shade(base.hex, 0.72);
  const activeView = VIEWS.find((v) => v.id === view)!;
  const viewBox = `0 0 ${shape.width} ${shape.height}`;
  // lo zoom delle viste ravvicinate non deve mai far uscire la targhetta dalla scena
  const zoomCap = (bh * 0.82) / Math.max(1, mmH * k);
  const zoom = Math.min(activeView.zoom, zoomCap);

  return (
    <div ref={outerRef} className="relative flex h-full w-full items-center justify-center">
      {/* fondale d'atmosfera per la vista "sul tavolo": sera al ristorante */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: -1,
          background: 'radial-gradient(120% 90% at 50% 30%, #463c2d 0%, #262019 55%, #141210 100%)',
          opacity: activeView.dark ? 1 : 0,
          transition: 'opacity 0.6s',
        }}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-end justify-center">
          <PhoneSilhouette w={PHONE_MM[0] * k} h={PHONE_MM[1] * k} gap={GAP_MM * k} visible={view === 'front'} />
          <div className="relative" style={{ perspective: '1100px' }}>
            {/* ombra di contatto sul tavolo */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: '50%',
                bottom: -plaqueW * 0.08,
                width: plaqueW * 1.35,
                height: plaqueW * 0.26,
                transform: 'translateX(-50%)',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 65%)',
                filter: 'blur(8px)',
                opacity: activeView.dark ? 1 : 0,
                transition: 'opacity 0.6s',
              }}
            />
            <div
              className="relative"
              style={{
                width: plaqueW,
                transformStyle: 'preserve-3d',
                transformOrigin: activeView.origin,
                transition: 'transform 0.65s cubic-bezier(0.3, 1.35, 0.4, 1)',
                transform: `scale(${zoom}) ${activeView.rotate}`,
              }}
            >
              {/* spessore: strati della stessa sagoma dietro la faccia frontale
                  (translateZ negativi) — nelle viste angolate il bordo sfalsato
                  appare come il fianco della targhetta, arco e angoli compresi */}
              {[t, t * 0.66, t * 0.33].map((depth) => (
                <div
                  key={depth}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `translateZ(${-depth}px)`,
                  }}
                >
                  <svg viewBox={viewBox} style={{ width: '100%', height: '100%' }}>
                    <path d={shape.path} fill={sideColor} />
                  </svg>
                </div>
              ))}
              <Preview config={config} widthPx={plaqueW} showCaption={false} />
            </div>
          </div>
        </div>
        <div style={{ opacity: view === 'front' || view === 'landscape' ? 1 : 0, transition: 'opacity 0.4s' }}>
          {view === 'landscape' ? (
            <LandscapeDims w={mmH * k * zoom} mmLabel={`${mmH} mm`} tPx={t * zoom} />
          ) : (
            <PlaqueCaption config={config} />
          )}
        </div>

        {/* viste: pill etichettate — righe sotto su mobile, colonna a sinistra su desktop */}
        <div className="mt-1 flex max-w-[92vw] flex-wrap justify-center gap-2 lg:absolute lg:left-6 lg:top-1/2 lg:mt-0 lg:max-w-none lg:-translate-y-1/2 lg:flex-col lg:items-start">
          {VIEWS.map((v) => (
            <ViewPill key={v.id} label={v.label} active={view === v.id} onClick={() => setView(v.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
