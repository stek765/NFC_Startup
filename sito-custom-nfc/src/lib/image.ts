export function targetSize(w: number, h: number, max = 1000): [number, number] {
  if (w <= max && h <= max) return [w, h];
  const k = Math.min(max / w, max / h);
  return [Math.round(w * k), Math.round(h * k)];
}

export function hasTransparency(rgba: Uint8ClampedArray): boolean {
  for (let i = 3; i < rgba.length; i += 4) {
    if (rgba[i] < 250) return true;
  }
  return false;
}

/**
 * L'anteprima colora la SILHOUETTE del logo (canale alpha) perché la stampa 3D
 * è un rilievo a un colore. Un JPG/PNG senza trasparenza è tutto opaco e
 * diventerebbe un rettangolo pieno: qui lo sfondo chiaro diventa trasparente e
 * il tratto scuro diventa la silhouette (luminanza → alpha, con rampa morbida
 * per non seghettare i bordi). Muta l'array in place.
 */
export function alphaFromLuminance(rgba: Uint8ClampedArray): void {
  for (let i = 0; i < rgba.length; i += 4) {
    const lum = (0.2126 * rgba[i] + 0.7152 * rgba[i + 1] + 0.0722 * rgba[i + 2]) / 255;
    const a = Math.max(0, Math.min(1, (0.82 - lum) / 0.25));
    rgba[i + 3] = Math.round(a * 255);
  }
}

export async function fileToDataUrl(file: File, max = 1000): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const [w, h] = targetSize(bitmap.width, bitmap.height, max);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  if (!hasTransparency(img.data)) {
    alphaFromLuminance(img.data);
    ctx.putImageData(img, 0, 0);
  }
  return canvas.toDataURL('image/png');
}
