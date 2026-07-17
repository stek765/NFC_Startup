import type { ReactElement } from 'react';
import { BASE_COLORS, FONTS, PRINT_COLORS, SHAPES, SIZES } from '../catalog';
import type { PlaqueConfig } from '../types';

/** Finto QR deterministico: pattern plausibile, il vero QR nasce in produzione */
function QrPlaceholder({ x, y, size, color }: { x: number; y: number; size: number; color: string }) {
  const n = 21;
  const cell = size / n;
  const rects: ReactElement[] = [];
  let seed = 42;
  const inFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      if (!inFinder(r, c) && seed % 100 < 45) {
        rects.push(<rect key={`${r}-${c}`} x={x + c * cell} y={y + r * cell} width={cell} height={cell} fill={color} />);
      }
    }
  }
  const finder = (fx: number, fy: number) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx} y={fy} width={cell * 7} height={cell * 7} fill="none" stroke={color} strokeWidth={cell} />
      <rect x={fx + cell * 2} y={fy + cell * 2} width={cell * 3} height={cell * 3} fill={color} />
    </g>
  );
  return (
    <g>
      {rects}
      {finder(x, y)}
      {finder(x + (n - 7) * cell, y)}
      {finder(x, y + (n - 7) * cell)}
    </g>
  );
}

function fitFontSize(text: string, maxSize: number, width: number): number {
  return Math.min(maxSize, (width * 1.7) / Math.max(text.length, 1));
}

export function PlaqueCaption({ config }: { config: PlaqueConfig }) {
  const shape = SHAPES.find((s) => s.id === config.shape)!;
  const size = SIZES.find((s) => s.id === config.size)!;
  const [mmW, mmH] = shape.mm[config.size];
  return (
    <p className="font-mono text-xs text-muted">
      {size.label} · {mmW}×{mmH} mm · NFC incluso
    </p>
  );
}

export default function Preview({
  config,
  widthPx,
  showCaption = true,
}: {
  config: PlaqueConfig;
  /** larghezza esatta in px (PreviewStage, scala millimetrica); senza, scala estetica in vmin */
  widthPx?: number;
  showCaption?: boolean;
}) {
  const shape = SHAPES.find((s) => s.id === config.shape)!;
  const base = BASE_COLORS.find((c) => c.id === config.baseColor)!;
  const print = PRINT_COLORS.find((c) => c.id === config.printColor)!;
  const font = FONTS.find((f) => f.id === config.font)!;
  const { topY, centerY, centerSize, bottomY } = shape.slots;
  const cx = shape.width / 2;

  // slot centrale: logo e QR si dividono lo spazio se attivi entrambi
  const both = config.qr && !!config.logo;
  const itemSize = both ? centerSize * 0.58 : centerSize;
  const gap = both ? centerSize * 0.12 : 0;
  const logoY = centerY - (both ? itemSize + gap / 2 : itemSize / 2);
  const qrY = both ? centerY + gap / 2 : centerY - itemSize / 2;

  const topFs = fitFontSize(config.textTop, 46, shape.width);
  const bottomFs = fitFontSize(config.textBottom, 40, shape.width);
  // scala visiva leggera per taglia: S 0.9, M 1, L 1.1
  const scale = { s: 0.9, m: 1, l: 1.1 }[config.size];

  return (
    <figure className="flex flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${shape.width} ${shape.height}`}
        style={{
          width: widthPx !== undefined ? `${widthPx}px` : `${(shape.width / 450) * 62 * scale}vmin`,
          maxWidth: widthPx !== undefined ? undefined : '86vw',
          filter: 'drop-shadow(0 18px 28px rgba(23,24,26,0.18))',
        }}
        role="img"
        aria-label="Anteprima targhetta"
      >
        <defs>
          <filter id="logo-mono">
            <feFlood floodColor={print.hex} result="tint" />
            <feComposite in="tint" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
        <path d={shape.path} fill={base.hex} />
        {config.textTop && (
          <>
            <text x={cx} y={topY} textAnchor="middle" fill={print.hex} style={{ font: `${topFs}px ${font.family}` }}>
              {config.textTop}
            </text>
            <line x1={cx - shape.width * 0.3} y1={topY + 22} x2={cx + shape.width * 0.3} y2={topY + 22} stroke={print.hex} strokeWidth="2.5" />
          </>
        )}
        {config.logo && (
          <image
            href={config.logo}
            x={cx - itemSize / 2}
            y={logoY}
            width={itemSize}
            height={itemSize}
            preserveAspectRatio="xMidYMid meet"
            filter="url(#logo-mono)"
          />
        )}
        {config.qr && <QrPlaceholder x={cx - itemSize / 2} y={qrY} size={itemSize} color={print.hex} />}
        {config.textBottom && (
          <>
            <line x1={cx - shape.width * 0.24} y1={bottomY - 38} x2={cx + shape.width * 0.24} y2={bottomY - 38} stroke={print.hex} strokeWidth="2.5" />
            <text x={cx} y={bottomY} textAnchor="middle" fill={print.hex} style={{ font: `${bottomFs}px ${font.family}` }}>
              {config.textBottom}
            </text>
          </>
        )}
      </svg>
      {showCaption && (
        <figcaption>
          <PlaqueCaption config={config} />
        </figcaption>
      )}
    </figure>
  );
}
