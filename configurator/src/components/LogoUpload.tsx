import { useRef, useState } from 'react';
import { fileToDataUrl } from '../lib/image';

export default function LogoUpload({
  value, onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpeg)$/.test(file.type)) {
      setError('Formato non supportato: usa PNG o JPG.');
      return;
    }
    try {
      onChange(await fileToDataUrl(file));
      setError(null);
    } catch {
      setError('Immagine non leggibile, prova con un altro file.');
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="flex items-center gap-4">
          <img src={value} alt="Logo caricato" className="h-16 w-16 rounded-lg border border-border bg-surface object-contain p-1" />
          <button type="button" onClick={() => onChange(null)} className="text-sm font-medium text-accent underline underline-offset-2">
            Rimuovi
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-lg border border-dashed border-border bg-surface px-4 py-6 text-sm font-medium text-muted"
        >
          Carica il logo (PNG o JPG)
        </button>
      )}
      {error && <p className="mt-2 text-sm text-accent">{error}</p>}
      <p className="mt-3 text-xs text-muted">
        Meglio un PNG con sfondo trasparente. In stampa il logo esce in un solo colore e i dettagli fini
        vengono semplificati — lo verifichiamo noi insieme al preventivo.
      </p>
    </div>
  );
}
