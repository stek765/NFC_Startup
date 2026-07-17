import type { PlaqueConfig, ShapeId, SizeId } from './types';

export interface ShapeDef {
  id: ShapeId;
  label: string;
  basePrice: number;
  width: number;
  height: number;
  path: string;
  mm: Record<SizeId, [number, number]>;
  slots: { topY: number; centerY: number; centerSize: number; bottomY: number };
}

export interface SizeDef { id: SizeId; label: string; priceDelta: number }
export interface ColorDef { id: string; label: string; hex: string; priceDelta: number }
export interface FontDef { id: string; label: string; family: string; priceDelta: number }

export const SHAPES: ShapeDef[] = [
  {
    id: 'verticale', label: 'Verticale', basePrice: 24,
    width: 300, height: 450,
    path: 'M18 0 H282 Q300 0 300 18 V432 Q300 450 282 450 H18 Q0 450 0 432 V18 Q0 0 18 0 Z',
    mm: { s: [60, 90], m: [80, 120], l: [100, 150] },
    slots: { topY: 88, centerY: 240, centerSize: 168, bottomY: 402 },
  },
  {
    id: 'orizzontale', label: 'Orizzontale', basePrice: 24,
    width: 450, height: 300,
    path: 'M18 0 H432 Q450 0 450 18 V282 Q450 300 432 300 H18 Q0 300 0 282 V18 Q0 0 18 0 Z',
    mm: { s: [90, 60], m: [120, 80], l: [150, 100] },
    slots: { topY: 66, centerY: 165, centerSize: 118, bottomY: 262 },
  },
  {
    id: 'arco', label: 'Ad arco', basePrice: 29,
    width: 300, height: 450,
    path: 'M0 150 A150 150 0 0 1 300 150 V432 Q300 450 282 450 H18 Q0 450 0 432 Z',
    mm: { s: [60, 90], m: [80, 120], l: [100, 150] },
    slots: { topY: 128, centerY: 272, centerSize: 158, bottomY: 414 },
  },
];

export const SIZES: SizeDef[] = [
  { id: 's', label: 'S', priceDelta: 0 },
  { id: 'm', label: 'M', priceDelta: 6 },
  { id: 'l', label: 'L', priceDelta: 12 },
];

export const BASE_COLORS: ColorDef[] = [
  { id: 'bianco', label: 'Bianco', hex: '#f2f0ea', priceDelta: 0 },
  { id: 'nero', label: 'Nero', hex: '#26262b', priceDelta: 0 },
  { id: 'grigio', label: 'Grigio', hex: '#9a9da1', priceDelta: 0 },
  { id: 'crema', label: 'Crema', hex: '#e6d9bd', priceDelta: 3 },
  { id: 'salvia', label: 'Salvia', hex: '#a9b7a0', priceDelta: 3 },
  { id: 'terracotta', label: 'Terracotta', hex: '#bd5f3e', priceDelta: 3 },
];

export const PRINT_COLORS: ColorDef[] = [
  { id: 'nero', label: 'Nero', hex: '#1e1e23', priceDelta: 0 },
  { id: 'bianco', label: 'Bianco', hex: '#f4f2ec', priceDelta: 0 },
  { id: 'blu-notte', label: 'Blu notte', hex: '#2c3a54', priceDelta: 0 },
  { id: 'oro', label: 'Oro', hex: '#b08d57', priceDelta: 2 },
];

export const FONTS: FontDef[] = [
  { id: 'firma', label: 'Firma', family: "'Pacifico', cursive", priceDelta: 0 },
  { id: 'classico', label: 'Classico', family: "'Playfair Display', serif", priceDelta: 0 },
  { id: 'moderno', label: 'Moderno', family: "'Bebas Neue', sans-serif", priceDelta: 0 },
  { id: 'pulito', label: 'Pulito', family: "'Poppins', sans-serif", priceDelta: 0 },
];

export const QR_PRICE = 4;
export const LOGO_PRICE = 7;
export const MAX_TEXT_LEN = 18;

// Rispecchia la targhetta di riferimento: bianca, script, Welcome/Enjoy, QR
export const DEFAULT_CONFIG: PlaqueConfig = {
  shape: 'verticale',
  size: 's',
  baseColor: 'bianco',
  printColor: 'nero',
  font: 'firma',
  textTop: 'Welcome',
  textBottom: 'Enjoy',
  qr: true,
  logo: null,
};
