import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLang } from '../i18n';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';

// Module-scoped: survives back-to-hero-and-forward within the same page load,
// resets only on a full reload (new NFC scan / browser refresh).
let dismissedThisLoad = false;

// Plain background starfield: fixed points, fixed size/opacity (brightness
// varies star to star, but statically — nothing twinkles here). Positions
// come from a small deterministic PRNG (not Math.random()) so the field is
// stable across reloads without hand-placing 46 points.
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const BACKGROUND_STARS = Array.from({ length: 46 }, (_, i) => {
  const left = seededRandom(i * 2.1 + 1) * 100;
  const top = seededRandom(i * 3.7 + 5) * 130;
  const brightness = seededRandom(i * 5.3 + 9);
  const size = 0.6 + brightness * 1.6;
  const opacity = 0.25 + brightness * 0.6;
  return { left, top, size, opacity };
});

// Three real constellations, each plotted from real right-ascension/
// declination values and normalized into the panel's coordinate space,
// scaled to sit entirely above the card. One is picked at random per visit
// — so guests at the same table, each on their own phone, are likely to see
// different ones. Star radius follows each star's real relative brightness.
interface ConstellationStar {
  name: string;
  x: number;
  y: number;
  r: number;
  color?: string;
}

interface Constellation {
  id: string;
  stars: readonly ConstellationStar[];
  edges: readonly [number, number][];
}

// The Big Dipper — the seven-star ladle of Ursa Major (Dubhe, Merak, Phecda,
// Megrez, Alioth, Mizar, Alkaid). The most universally recognizable, cleanly
// "minimal" shape there is — a bowl plus a curved handle, no crossing lines.
const DIPPER: Constellation = {
  id: 'dipper',
  stars: [
    { name: 'dubhe', x: 69.5, y: 4.0, r: 1.25 },
    { name: 'merak', x: 70.0, y: 21.3, r: 0.95 },
    { name: 'phecda', x: 54.3, y: 29.9, r: 0.9 },
    { name: 'megrez', x: 47.8, y: 19.2, r: 0.65 },
    { name: 'alioth', x: 36.2, y: 22.6, r: 1.3 },
    { name: 'mizar', x: 27.1, y: 26.0, r: 1.0 },
    { name: 'alkaid', x: 20.0, y: 44.0, r: 1.2 },
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]],
};

// Cassiopeia — the five-star "W" (Caph, Schedar, Gamma Cas, Ruchbah, Segin).
// A simple zig-zag chain, as iconic and easy to pick out as the Dipper.
const CASSIOPEIA: Constellation = {
  id: 'cassiopeia',
  stars: [
    { name: 'caph', x: 70.0, y: 29.4, r: 1.05 },
    { name: 'schedar', x: 55.1, y: 44.0, r: 1.1 },
    { name: 'gammacas', x: 47.4, y: 20.6, r: 1.0 },
    { name: 'ruchbah', x: 33.6, y: 23.3, r: 0.85 },
    { name: 'segin', x: 20.0, y: 4.0, r: 0.65 },
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
};

// Scorpius — the curved hook of the scorpion, from the head (Dschubba) down
// through Antares (its bright red heart) to the tail's stinger (Shaula).
// The one genuinely curved shape of the three, no straight chain. Antares
// gets its own warm-red tint — that's the star's real, famous color.
const SCORPIUS: Constellation = {
  id: 'scorpius',
  stars: [
    { name: 'dschubba', x: 70.0, y: 4.0, r: 1.0 },
    { name: 'antares', x: 54.3, y: 11.7, r: 1.4, color: '#e08a5c' },
    { name: 'tausco', x: 50.6, y: 15.3, r: 0.8 },
    { name: 'epsilonsco', x: 43.1, y: 27.6, r: 1.0 },
    { name: 'musco', x: 42.1, y: 35.3, r: 0.75 },
    { name: 'zetasco', x: 40.4, y: 44.0, r: 0.65 },
    { name: 'kappasco', x: 15.0, y: 37.2, r: 0.95 },
    { name: 'shaula', x: 19.7, y: 33.4, r: 1.15 },
  ],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]],
};

const CONSTELLATIONS = [DIPPER, CASSIOPEIA, SCORPIUS];

function NightSky() {
  const [constellation] = useState(() => CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BACKGROUND_STARS.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity }}
        />
      ))}
      {/* Soft nebula glow behind the figure, for depth — static, so it never
          competes with the constellation's own animation. */}
      <motion.div
        aria-hidden
        className="absolute left-[45%] top-[10%] h-64 w-64 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, #3a4a8a 0%, transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 2 }}
      />
      <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {constellation.edges.map(([a, b], i) => {
          const p1 = constellation.stars[a];
          const p2 = constellation.stars[b];
          return (
            <motion.line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#dbe8ff"
              strokeWidth={0.22}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 1, delay: 0.3 + i * 0.18, ease: 'easeOut' }}
            />
          );
        })}
        {constellation.stars.map((s, i) => (
          <motion.circle
            key={s.name}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.color ?? '#f4ecd8'}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0.7, 1], scale: [0, 1.4, 1, 1.25] }}
            transition={{
              opacity: { duration: 0.5, delay: 0.3 + i * 0.18 },
              scale: { duration: 0.5, delay: 0.3 + i * 0.18 },
            }}
            style={{ transformOrigin: `${s.x}px ${s.y}px` }}
          />
        ))}
        {constellation.stars.map((s, i) => (
          <motion.circle
            key={`${s.name}-glow`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.color ?? '#f4ecd8'}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 3.2,
              delay: 2.2 + i * 0.18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: `${s.x}px ${s.y}px` }}
          />
        ))}
      </svg>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.3 }}
        className="absolute bottom-[6%] left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.4em] text-gold/80"
      >
        Notte Dì
      </motion.p>
    </div>
  );
}

export function MenuHint() {
  const { t } = useLang();
  const [visible, setVisible] = useState(() => !dismissedThisLoad);
  const reduceMotion = useReducedMotion();
  useLockBodyScroll(visible);

  function dismiss() {
    dismissedThisLoad = true;
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22 } }}
          transition={{ duration: 0.3 }}
          className="fixed -inset-2 z-40 flex items-center justify-center overflow-hidden bg-[#0b0f1e]/58 px-8 backdrop-blur-[2px]"
        >
          {!reduceMotion && <NightSky />}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.2 } }}
            transition={reduceMotion ? { duration: 0.3 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inverted pointer-events-auto relative max-w-[300px] rounded-3xl border border-gold/25 bg-bg/95 px-6 py-6 text-center shadow-[0_12px_32px_rgba(0,0,0,0.3)] backdrop-blur-md"
          >
            <p className="text-[15px] font-normal leading-relaxed text-text/90">{t.menuHint}</p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-4 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-gold active:opacity-60"
            >
              {t.gotIt}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
