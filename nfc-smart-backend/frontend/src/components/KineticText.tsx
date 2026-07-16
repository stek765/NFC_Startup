import { motion } from 'motion/react';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const word = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function KineticText({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3, margin: '0px 0px -10% 0px' }}
      variants={container}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
          <motion.span className="inline-block" variants={word}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
