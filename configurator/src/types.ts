export type ShapeId = 'verticale' | 'orizzontale' | 'arco';
export type SizeId = 's' | 'm' | 'l';

export interface PlaqueConfig {
  shape: ShapeId;
  size: SizeId;
  baseColor: string;
  printColor: string;
  font: string;
  textTop: string;
  textBottom: string;
  qr: boolean;
  /** dataURL PNG ridimensionato client-side, null = nessun logo */
  logo: string | null;
}
