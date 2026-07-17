export function targetSize(w: number, h: number, max = 1000): [number, number] {
  if (w <= max && h <= max) return [w, h];
  const k = Math.min(max / w, max / h);
  return [Math.round(w * k), Math.round(h * k)];
}

export async function fileToDataUrl(file: File, max = 1000): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const [w, h] = targetSize(bitmap.width, bitmap.height, max);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL('image/png');
}
