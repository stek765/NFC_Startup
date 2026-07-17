import { BASE_COLORS, DEFAULT_CONFIG, FONTS, MAX_TEXT_LEN, PRINT_COLORS, SHAPES, SIZES } from '../catalog';
import { isReadable } from '../lib/readability';
import type { PlaqueConfig } from '../types';

function pickId<T extends { id: string }>(list: T[], value: unknown, fallback: string): string {
  return typeof value === 'string' && list.some((item) => item.id === value) ? value : fallback;
}

function cleanText(value: unknown, fallback: string): string {
  return (typeof value === 'string' ? value : fallback).slice(0, MAX_TEXT_LEN);
}

export function sanitizeConfig(raw: unknown): PlaqueConfig {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_CONFIG };
  const r = raw as Record<string, unknown>;
  return {
    shape: pickId(SHAPES, r.shape, DEFAULT_CONFIG.shape) as PlaqueConfig['shape'],
    size: pickId(SIZES, r.size, DEFAULT_CONFIG.size) as PlaqueConfig['size'],
    baseColor: pickId(BASE_COLORS, r.baseColor, DEFAULT_CONFIG.baseColor),
    printColor: pickId(PRINT_COLORS, r.printColor, DEFAULT_CONFIG.printColor),
    font: pickId(FONTS, r.font, DEFAULT_CONFIG.font),
    textTop: cleanText(r.textTop, DEFAULT_CONFIG.textTop),
    textBottom: cleanText(r.textBottom, DEFAULT_CONFIG.textBottom),
    qr: typeof r.qr === 'boolean' ? r.qr : DEFAULT_CONFIG.qr,
    logo: typeof r.logo === 'string' && r.logo.startsWith('data:image/') ? r.logo : null,
  };
}

export function applyBaseColor(cfg: PlaqueConfig, baseId: string): PlaqueConfig {
  const base = BASE_COLORS.find((c) => c.id === baseId);
  if (!base) return cfg;
  const print = PRINT_COLORS.find((c) => c.id === cfg.printColor)!;
  if (isReadable(base.hex, print.hex)) return { ...cfg, baseColor: baseId };
  const firstReadable = PRINT_COLORS.find((c) => isReadable(base.hex, c.hex))!;
  return { ...cfg, baseColor: baseId, printColor: firstReadable.id };
}
