import Preview from './components/Preview';
import { DEFAULT_CONFIG } from './catalog';

export default function App() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_440px]">
      <div className="sticky top-0 z-10 flex h-[44vh] items-center justify-center bg-stage lg:h-screen">
        <Preview config={DEFAULT_CONFIG} />
      </div>
      <main className="px-5 pb-40 pt-8 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">NFC Smart</p>
        <h1 className="mt-2 text-3xl font-bold">Componi la tua targhetta</h1>
      </main>
    </div>
  );
}
