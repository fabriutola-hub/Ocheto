import { motion } from 'framer-motion';
import { STATS } from '@/data';
import ManifestoText from './ManifestoText';
import ManifestoVisual from './ManifestoVisual';

export default function Manifesto() {
  return (
    <section
      id="manifesto"
      className="relative w-full overflow-hidden bg-ocheto-cream-50 dots-bg section-padding"
    >
      {/* ===== BIG BACKGROUND QUOTE MARKS ===== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-start justify-center overflow-hidden"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 0.06, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="font-fraunces select-none -translate-y-6 leading-none"
          style={{
            fontSize: 'clamp(20rem, 42vw, 56rem)',
            color: 'hsl(var(--ocheto-coffee-900))',
            fontWeight: 700,
          }}
        >
          “
        </motion.span>
      </div>

      {/* ===== SOFT TOP FADE ===== */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, hsl(var(--ocheto-cream-50)) 0%, transparent 100%)',
        }}
      />

      {/* ===== MAIN CONTAINER ===== */}
      <div className="relative z-10 container-ocheto">
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* ===== VERTICAL DIVIDER (desktop only) ===== */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 -translate-y-1/2"
            style={{
              left: '60%',
              width: '1px',
              height: '70%',
              background:
                'linear-gradient(to bottom, transparent 0%, hsl(var(--ocheto-green-700) / 0.25) 30%, hsl(var(--ocheto-green-700) / 0.25) 70%, transparent 100%)',
            }}
          />

          {/* ====================================================== */}
          {/* LEFT COLUMN — 60% Editorial Text                       */}
          {/* ====================================================== */}
          <ManifestoText />

          {/* ====================================================== */}
          {/* RIGHT COLUMN — 40% Visual Composition                  */}
          {/* ====================================================== */}
          <ManifestoVisual />
        </div>

        {/* ===== BOTTOM MARQUEE STRIP (DATA-DRIVEN) ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 lg:mt-32 border-t border-b border-ocheto-green-700/15 py-5 overflow-hidden"
        >
          <div className="marquee">
            <div className="marquee-track">
              {[...STATS, ...STATS, ...STATS].map((stat, i) => (
                <div
                  key={`${stat.label}-${i}`}
                  className="flex items-center gap-4 flex-shrink-0"
                >
                  <span
                    aria-hidden="true"
                    className="block w-1.5 h-1.5 rounded-full bg-ocheto-caramel-500"
                  />
                  <span className="font-fraunces italic font-light text-ocheto-coffee-900 text-2xl sm:text-3xl tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-ocheto-coffee-700">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
