import { BASE_COLORS, FONTS, LOGO_PRICE, PRINT_COLORS, QR_PRICE, SHAPES, SIZES } from '../catalog';
import type { PlaqueConfig } from '../types';

function must<T extends { id: string }>(list: T[], id: string, what: string): T {
  const found = list.find((item) => item.id === id);
  if (!found) throw new Error(`${what} sconosciuto: ${id}`);
  return found;
}

export function computePrice(cfg: PlaqueConfig): number {
  const shape = must(SHAPES, cfg.shape, 'forma');
  const size = must(SIZES, cfg.size, 'taglia');
  const base = must(BASE_COLORS, cfg.baseColor, 'colore targhetta');
  const print = must(PRINT_COLORS, cfg.printColor, 'colore stampa');
  const font = must(FONTS, cfg.font, 'font');

  return (
    shape.basePrice +
    size.priceDelta +
    base.priceDelta +
    print.priceDelta +
    font.priceDelta +
    (cfg.qr ? QR_PRICE : 0) +
    (cfg.logo ? LOGO_PRICE : 0)
  );
}
