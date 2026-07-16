import { KineticText } from './KineticText';

export function CategoryHeader({ name, index }: { name: string; index: number }) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div className="mb-4 pt-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.45em] text-gold">{num}</p>
      <h2 className="mt-2 font-display text-[34px] font-medium leading-tight text-text">
        <KineticText text={name} />
      </h2>
      <span className="mt-3 block h-px w-12 bg-gold" />
    </div>
  );
}
