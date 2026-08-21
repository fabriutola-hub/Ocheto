import { motion } from 'framer-motion';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { GALLERY_IMAGES, SOCIAL_LINKS } from '@/data';

interface GalleryTile {
  src: string;
  caption: string;
  span: string;
}

const TILES: GalleryTile[] = [
  { src: GALLERY_IMAGES[0], caption: 'Equipo Ocheto en la montaña 🏔️', span: 'lg:col-span-2 lg:row-span-2' },
  { src: GALLERY_IMAGES[1], caption: 'Lleva Ocheto a donde vayas ☕', span: 'lg:col-span-1 lg:row-span-1' },
  { src: GALLERY_IMAGES[2], caption: 'Vaso verde, montañas azules 💚', span: 'lg:col-span-1 lg:row-span-1' },
  { src: GALLERY_IMAGES[3], caption: 'Tazas con cariño 🐻', span: 'lg:col-span-1 lg:row-span-1' },
  { src: GALLERY_IMAGES[4], caption: 'El ritual del espresso', span: 'lg:col-span-1 lg:row-span-2' },
  { src: GALLERY_IMAGES[5], caption: 'Frappé de frutilla 🍓', span: 'lg:col-span-1 lg:row-span-1' },
  { src: GALLERY_IMAGES[6], caption: 'Te esperamos en una de las tiendas', span: 'lg:col-span-1 lg:row-span-1' },
  { src: GALLERY_IMAGES[7], caption: 'Detrás de la barra', span: 'lg:col-span-2 lg:row-span-1' },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

function GalleryTile({ src, caption, span, index }: GalleryTile & { index: number }) {
  return (
    <motion.a
      href={SOCIAL_LINKS.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Ver en Instagram: ${caption}`}
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className={`group relative overflow-hidden rounded-2xl lg:rounded-3xl bg-ocheto-coffee-900 ring-1 ring-ocheto-coffee-900/5 shadow-sm hover:shadow-2xl hover:shadow-ocheto-coffee-900/15 transition-shadow duration-500 ${span}`}
    >
      {/* Image */}
      <img
        src={src}
        alt={caption}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-110"
      />

      {/* Permanent subtle bottom gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-ocheto-coffee-900/70 via-ocheto-coffee-900/10 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Hover Instagram icon - centered */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-ocheto-cream-50/95 backdrop-blur-sm flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500 ring-1 ring-ocheto-cream-50/60">
          <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-ocheto-green-700" strokeWidth={2} />
        </div>
      </div>

      {/* Caption overlay - slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-ocheto-gold-500" />
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-ocheto-gold-500 font-semibold">
            @ochetocoffee
          </span>
        </div>
        <p className="font-caveat text-xl sm:text-2xl lg:text-[1.75rem] text-ocheto-cream-50 leading-none drop-shadow-md">
          {caption}
        </p>
      </div>
    </motion.a>
  );
}

function FeedCtaTile() {
  return (
    <motion.a
      href={SOCIAL_LINKS.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ver más en Instagram"
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.65,
        delay: TILES.length * 0.08,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      className="group lg:col-span-2 lg:row-span-1 relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-br from-ocheto-green-700 via-ocheto-green-800 to-ocheto-coffee-900 p-5 sm:p-6 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-ocheto-green-900/30 transition-shadow duration-500"
    >
      {/* Decorative gradient blobs */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 25%, hsl(42 85% 55%) 0%, transparent 45%), radial-gradient(circle at 85% 80%, hsl(32 60% 60%) 0%, transparent 45%)',
        }}
      />

      {/* Subtle grain on the tile */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#FEDA75] via-[#FA7E1E] to-[#D62976] flex items-center justify-center shadow-lg ring-2 ring-ocheto-cream-50/20 group-hover:scale-110 transition-transform duration-500">
            <Instagram className="h-5 w-5 sm:h-6 sm:w-6 text-ocheto-cream-50" strokeWidth={2.25} />
          </div>
          <div className="hidden sm:block">
            <p className="text-ocheto-cream-50 font-semibold text-sm leading-tight">@ochetocoffee</p>
            <p className="text-ocheto-cream-100/60 text-xs leading-tight">Síguenos</p>
          </div>
        </div>
        <ArrowUpRight
          className="h-5 w-5 text-ocheto-gold-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
          strokeWidth={2.25}
        />
      </div>

      <div className="relative z-10">
        <p className="font-caveat text-2xl sm:text-3xl lg:text-4xl text-ocheto-gold-500 leading-none mb-1 group-hover:translate-x-1 transition-transform duration-500">
          y mucho más
        </p>
        <p className="text-ocheto-cream-50 text-sm sm:text-base font-medium leading-snug">
          en nuestro feed diario ☕
        </p>
      </div>
    </motion.a>
  );
}

export default function Gallery() {
  return (
    <section
      id="galeria"
      className="relative w-full overflow-hidden bg-ocheto-cream-50 grain-texture section-padding"
    >
      {/* Decorative ambient glows */}
      <div
        className="absolute top-1/4 -left-40 w-[28rem] h-[28rem] rounded-full opacity-25 pointer-events-none blur-2xl"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-caramel-500)) 0%, transparent 65%)',
        }}
      />
      <div
        className="absolute bottom-1/4 -right-40 w-[32rem] h-[32rem] rounded-full opacity-20 pointer-events-none blur-2xl"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--ocheto-green-700)) 0%, transparent 65%)',
        }}
      />

      {/* Decorative dotted pattern strip - top right */}
      <div className="absolute top-12 right-8 hidden lg:block opacity-30 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <pattern id="galleryDots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="hsl(var(--ocheto-green-700))" />
          </pattern>
          <rect width="120" height="120" fill="url(#galleryDots)" />
        </svg>
      </div>

      <div className="relative z-10 container-ocheto">
        {/* ============ HEADER ============ */}
        <motion.div
          {...fadeInUp}
          className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 sm:w-12 bg-ocheto-caramel-500/70" />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ocheto-cream-100 border border-ocheto-caramel-500/30 text-ocheto-green-700 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] shadow-sm">
              <Instagram className="h-3 w-3" strokeWidth={2.5} />
              @OCHETOCOFFEE · Instagram
            </span>
            <span className="h-px w-8 sm:w-12 bg-ocheto-caramel-500/70" />
          </div>

          {/* Headline */}
          <h2 className="font-fraunces italic font-light leading-[0.92] tracking-[-0.025em] text-ocheto-coffee-900 text-[clamp(3rem,9vw,6.5rem)]">
            Momentos <span className="text-ocheto-green-700 not-italic font-medium">Ocheto</span>
            <span className="text-ocheto-caramel-500">.</span>
          </h2>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-ocheto-coffee-700/75 max-w-xl mx-auto leading-relaxed">
            Síguenos para más{' '}
            <span className="font-caveat text-2xl sm:text-3xl text-ocheto-caramel-600 -rotate-1 inline-block">
              inspiración cafetera
            </span>{' '}
            diaria.
          </p>

          {/* Mini stats */}
          <div className="mt-8 flex items-center justify-center gap-4 sm:gap-7 text-xs sm:text-sm text-ocheto-coffee-700/65 flex-wrap">
            <Stat value="2.4k" label="Posts" />
            <Divider />
            <Stat value="18.6k" label="Seguidores" />
            <Divider />
            <Stat value="8" label="Años" />
          </div>
        </motion.div>

        {/* ============ MASONRY GRID ============ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 grid-flow-dense auto-rows-[180px] sm:auto-rows-[200px]">
          {TILES.map((tile, i) => (
            <GalleryTile key={i} {...tile} index={i} />
          ))}
          <FeedCtaTile />
        </div>

        {/* ============ BOTTOM CTA ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-12 sm:mt-16 lg:mt-20 flex flex-col items-center gap-5"
        >
          {/* Hand-written note */}
          <div className="relative">
            <p className="font-caveat text-2xl sm:text-3xl text-ocheto-coffee-700/70 -rotate-2 inline-block">
              latte art, behind the scenes & cafecitos que se merecen un like
            </p>
            {/* Hand-drawn underline */}
            <svg
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-3 pointer-events-none"
              viewBox="0 0 240 12"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M2 7C40 3 80 9 120 5C160 1 200 8 238 4"
                stroke="hsl(var(--ocheto-caramel-500))"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Main CTA button */}
          <motion.a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="btn-primary group text-base sm:text-lg px-7 sm:px-9 py-3.5 sm:py-4"
          >
            <Instagram
              className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-12"
              strokeWidth={2}
            />
            <span>Síguenos en Instagram</span>
            <ArrowUpRight
              className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              strokeWidth={2.5}
            />
          </motion.a>

          {/* Handle below button */}
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-ocheto-coffee-700/50 hover:text-ocheto-green-700 transition-colors duration-300 tracking-wide"
          >
            instagram.com/<span className="font-semibold">ocheto2020</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-fraunces italic text-ocheto-green-700 font-semibold text-lg sm:text-xl">
        {value}
      </span>
      <span className="uppercase tracking-[0.18em] text-[10px] sm:text-xs">{label}</span>
    </div>
  );
}

function Divider() {
  return <span className="h-1 w-1 rounded-full bg-ocheto-coffee-700/30" aria-hidden />;
}
