import type { CSSProperties } from 'react';
import dividerUrl from '../assets/ornaments/section-divider.png';
import vineUrl from '../assets/ornaments/section-vine.png';

const maskBase: CSSProperties = {
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: '100% 100%',
  maskSize: '100% 100%',
};

export function SectionDivider({ vineSide }: { vineSide?: 'left' | 'right' }) {
  return (
    <div className="relative my-8">
      <div
        className="w-full bg-gold opacity-25"
        style={{
          ...maskBase,
          WebkitMaskImage: `url(${dividerUrl})`,
          maskImage: `url(${dividerUrl})`,
          aspectRatio: '580 / 27',
        }}
      />
      {vineSide && (
        <div
          className={`pointer-events-none absolute top-1/2 h-[170px] w-10 -translate-y-1/2 ${
            vineSide === 'left' ? '-left-8' : '-right-8 scale-x-[-1]'
          }`}
        >
          <div
            className="absolute inset-0 bg-gold opacity-[0.06]"
            style={{
              ...maskBase,
              WebkitMaskImage: `url(${vineUrl})`,
              maskImage: `url(${vineUrl})`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, var(--color-bg) 0%, transparent 22%, transparent 78%, var(--color-bg) 100%)',
            }}
          />
        </div>
      )}
    </div>
  );
}
