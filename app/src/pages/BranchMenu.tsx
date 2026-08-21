import { EASE, useInfiniteAnimation } from '@/shared/motion';
import { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { motion, useScroll, useTransform, type Variants } from 'framer-motion';
import { Coffee, Sparkles } from 'lucide-react';
import { useBranchMenu, branchIdFromSlug } from '@/features/menu/queries';
import { LOCATIONS } from '@/data/locations';
import ProductCard from '@/shared/ProductCard';
import { supabase } from '@/lib/supabase';
import type { BranchMenuItemRow } from '@/features/products/types';
import type { Product } from '@/types';

function resolveBranchImage(raw?: string | null): string {
  if (!raw) return '/assets/vaso-cafe.webp';
  if (raw.startsWith('http') || raw.startsWith('/assets') || raw.startsWith('/')) return raw;
  const path = raw.startsWith('site-images/') ? raw.replace('site-images/', '') : raw.replace('branch-menus/', '').replace('branch_menus/', '');
  const { data } = supabase.storage.from('site-images').getPublicUrl(path);
  return data.publicUrl || raw;
}

const BRANCH_DISPLAY_NAMES: Record<string, string> = {
  'federico-suazo': 'Federico Suazo',
  oruro: 'Oruro',
  illampu: 'Illampu',
};

const BRANCH_ADDRESSES: Record<string, string> = {
  'federico-suazo': 'C. Federico Zuazo casi esq. Reyes Ortiz',
  oruro: 'C. Oruro entre C. Murillo y Mariscal Santa Cruz',
  illampu: 'Av. Illampu cerca a la Esquina Santa Cruz, Hotel Berlina',
};

function menuItemsToProducts(items: BranchMenuItemRow[]): Product[] {
  const products: Product[] = [];

  items.forEach((item) => {
    const descParts = [item.item_description ?? ''].filter(Boolean);
    if (item.section_subtitle) {
      descParts.unshift(item.section_subtitle);
    }
    const image = resolveBranchImage((item as any).image_url as string | undefined);
    products.push({
      id: item.id,
      slug: `branch-${item.id}`,
      name: item.item_name,
      category: 'specialty',
      description: descParts.join(' • ') || item.section_title,
      price: item.price_regular,
      priceGrande: item.price_grande,
      image,
      color: '#8B6914',
      tags: [item.section_title],
      temperature: 'both',
    });
  });

  return products;
}

function BranchHero({ branchName }: { branchName: string }) {
  const slug = branchName.toLowerCase().replace(/\s/g, '-');
  const address = BRANCH_ADDRESSES[slug] ?? '';

  if (slug === 'federico-suazo') {
    return <FedericoSuazoHero branchName={branchName} address={address} />;
  }
  if (slug === 'oruro') {
    return <OruroHero branchName={branchName} address={address} />;
  }
  return <IllampuHero branchName={branchName} address={address} />;
}

/* ── Federico Suazo: Warm espresso bar, split layout ── */
function FedericoSuazoHero({ branchName, address }: { branchName: string; address: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);
  const animateInfinite = useInfiniteAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[55vh] sm:min-h-[65vh] overflow-hidden"
      aria-label={`Menú de ${branchName}`}
    >
      {/* Warm coffee-toned background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, hsl(28 60% 12%) 0%, hsl(32 55% 18%) 40%, hsl(26 50% 22%) 100%)',
        }}
      />

      {/* Parallax image */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY }}
      >
        <img
          src="/assets/wallaper_1.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover mix-blend-overlay opacity-60"
        />
      </motion.div>

      {/* Radial glow */}
      <motion.div
        aria-hidden
        animate={animateInfinite ? { opacity: [0.3, 0.55, 0.3] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-[15%] z-[2] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(38 85% 55% / 0.3) 0%, transparent 65%)',
        }}
      />

      <motion.div
        className="relative z-10 min-h-[55vh] sm:min-h-[65vh] flex items-center"
        style={{ y: contentY, opacity }}
      >
        <div className="container-ocheto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(38_85%_55%_/0.15)] border border-[hsl(38_85%_55%_/0.35)] backdrop-blur-md mb-5">
                <Coffee className="w-3.5 h-3.5 text-[hsl(38_85%_55%)]" strokeWidth={2.5} />
                <span className="text-[10px] tracking-[0.25em] font-bold uppercase text-[hsl(38_85%_55%)]">
                  Sucursal Centro
                </span>
              </div>
              <h1
                className="font-fraunces italic font-medium text-[hsl(38_90%_88%)] leading-[0.92] tracking-tight"
                style={{
                  fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                  fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
                }}
              >
                <span className="relative inline-block">
                  <span
                    className="absolute inset-x-0 bottom-1.5 sm:bottom-2.5 h-2.5 sm:h-3.5 -z-0 rounded-sm"
                    style={{ background: 'hsl(38_85%_55%_/0.4)' }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10 text-[hsl(38_85%_55%)]">
                    {branchName}
                  </span>
                </span>
              </h1>
              <p className="mt-4 text-[hsl(38_20%_78%)] text-sm sm:text-base font-light max-w-md mx-auto lg:mx-0">
                {address}
              </p>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
                className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-[hsl(38_85%_55%)] text-xs font-semibold uppercase tracking-widest"
              >
                <span className="w-8 h-px bg-[hsl(38_85%_55%)]" />
                Menú completo
                <span className="w-8 h-px bg-[hsl(38_85%_55%)]" />
              </motion.div>
            </motion.div>

            {/* Right: Featured drink visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <motion.div
                animate={animateInfinite ? { y: [-8, 8, -8], rotate: [-2, 2, -2] } : undefined}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <img
                  src="/assets/vaso-cafe.webp"
                  alt="Café Ocheto"
                  className="w-[280px] h-[280px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                  draggable={false}
                />
              </motion.div>
              {/* Back glow */}
              <div
                className="absolute inset-0 z-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, hsl(38_85%_55%_/0.25) 0%, transparent 70%)',
                  transform: 'scale(1.4)',
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Curved bottom */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50C40 38 80 62 120 48C160 34 200 58 240 44C280 30 320 54 360 40C400 26 440 50 480 36C520 22 560 46 600 32C640 18 680 42 720 28C760 14 800 38 840 24C880 10 920 34 960 20C1000 6 1040 30 1080 16C1120 2 1160 26 1200 12C1240 -2 1280 22 1320 8C1360 -6 1400 14 1440 0V100H0V50Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
        </svg>
      </div>
    </section>
  );
}

/* ── Oruro: High-altitude modern, cool slate tones ── */
function OruroHero({ branchName, address }: { branchName: string; address: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0.4]);
  const animateInfinite = useInfiniteAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[55vh] sm:min-h-[65vh] overflow-hidden"
      aria-label={`Menú de ${branchName}`}
    >
      {/* Cool slate background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, hsl(215 40% 14%) 0%, hsl(220 35% 18%) 50%, hsl(210 30% 22%) 100%)',
        }}
      />

      {/* Parallax image */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY }}
      >
        <img
          src="/assets/wallaper_1.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-30"
        />
      </motion.div>

      {/* Geometric accent lines */}
      <div aria-hidden className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <motion.div
          animate={animateInfinite ? { opacity: [0.15, 0.35, 0.15] } : undefined}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] right-[5%] w-[1px] h-[60vh] bg-gradient-to-b from-transparent via-[hsl(200_60%_70%)] to-transparent"
        />
        <motion.div
          animate={animateInfinite ? { opacity: [0.1, 0.25, 0.1] } : undefined}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute bottom-[15%] left-[10%] w-[1px] h-[40vh] bg-gradient-to-b from-transparent via-[hsl(190_50%_65%)] to-transparent"
        />
        <div
          className="absolute top-[25%] left-[20%] w-[300px] h-[300px] rounded-full border border-[hsl(200_60%_70%_/0.12)]"
        />
        <div
          className="absolute top-[25%] left-[20%] w-[200px] h-[200px] rounded-full border border-[hsl(200_60%_70%_/0.18)]"
        />
      </div>

      <motion.div
        className="relative z-10 min-h-[55vh] sm:min-h-[65vh] flex items-center"
        style={{ opacity }}
      >
        <div className="container-ocheto w-full">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(200_60%_70%_/0.12)] border border-[hsl(200_60%_70%_/0.3)] backdrop-blur-md mb-5">
                <Sparkles className="w-3.5 h-3.5 text-[hsl(200_60%_70%)]" strokeWidth={2.5} />
                <span className="text-[10px] tracking-[0.25em] font-bold uppercase text-[hsl(200_60%_70%)]">
                  Altura y sabor
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
              className="font-fraunces italic font-medium text-[hsl(200_55%_85%)] leading-[0.92] tracking-tight"
              style={{
                fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
              }}
            >
              <span className="relative inline-block">
                <span
                  className="absolute inset-x-0 bottom-1.5 sm:bottom-2.5 h-2.5 sm:h-3.5 -z-0 rounded-sm"
                  style={{ background: 'hsl(200_60%_70%_/0.3)' }}
                  aria-hidden="true"
                />
                <span className="relative z-10 text-[hsl(200_60%_70%)]">
                  {branchName}
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
              className="mt-5 text-[hsl(200_25%_70%)] text-sm sm:text-base font-light"
            >
              {address}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.65 }}
              className="mt-8 flex items-center justify-center gap-1"
            >
              <span className="block w-2 h-2 rounded-full bg-[hsl(200_60%_70%)]" />
              <span className="block w-1.5 h-1.5 rounded-full bg-[hsl(200_60%_70%/0.6)]" />
              <span className="block w-1 h-1 rounded-full bg-[hsl(200_60%_70%/0.3)]" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Curved bottom */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50C40 38 80 62 120 48C160 34 200 58 240 44C280 30 320 54 360 40C400 26 440 50 480 36C520 22 560 46 600 32C640 18 680 42 720 28C760 14 800 38 840 24C880 10 920 34 960 20C1000 6 1040 30 1080 16C1120 2 1160 26 1200 12C1240 -2 1280 22 1320 8C1360 -6 1400 14 1440 0V100H0V50Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
        </svg>
      </div>
    </section>
  );
}

/* ── Illampu: Elegant, gold & deep green, refined ── */
function IllampuHero({ branchName, address }: { branchName: string; address: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.4]);
  const animateInfinite = useInfiniteAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[55vh] sm:min-h-[65vh] overflow-hidden"
      aria-label={`Menú de ${branchName}`}
    >
      {/* Deep elegant background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, hsl(150 45% 10%) 0%, hsl(155 40% 14%) 50%, hsl(145 35% 18%) 100%)',
        }}
      />

      {/* Parallax image */}
      <motion.div
        aria-hidden
        className="absolute inset-0 z-0 will-change-transform"
        style={{ y: bgY, scale: bgScale }}
      >
        <img
          src="/assets/wallaper_1.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-40"
        />
      </motion.div>

      {/* Atmospheric glows */}
      <motion.div
        aria-hidden
        animate={animateInfinite ? { opacity: [0.25, 0.5, 0.25], scale: [0.95, 1.1, 0.95] } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[20%] right-[10%] z-[2] w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(45 80% 55% / 0.2) 0%, transparent 65%)',
        }}
      />
      <motion.div
        aria-hidden
        animate={animateInfinite ? { opacity: [0.2, 0.4, 0.2], scale: [0.9, 1.05, 0.9] } : undefined}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[20%] left-[8%] z-[2] w-[35vw] h-[35vw] max-w-[350px] max-h-[350px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, hsl(150 50% 40% / 0.15) 0%, transparent 65%)',
        }}
      />

      <motion.div
        className="relative z-10 min-h-[55vh] sm:min-h-[65vh] flex items-center"
        style={{ opacity }}
      >
        <div className="container-ocheto w-full">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="flex justify-center mb-5"
            >
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[hsl(45_80%_55%_/0.1)] border border-[hsl(45_80%_55%_/0.3)] backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[hsl(45_80%_55%)]" />
                <span className="text-[10px] tracking-[0.28em] font-bold uppercase text-[hsl(45_80%_55%)]">
                  Sucursal Illampu
                </span>
                <span className="w-2 h-2 rounded-full bg-[hsl(45_80%_55%)]" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
              className="font-fraunces italic font-medium text-[hsl(45_75%_85%)] leading-[0.92] tracking-tight"
              style={{
                fontSize: 'clamp(3rem, 9vw, 6rem)',
                fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
              }}
            >
              <span className="relative inline-block">
                <span
                  className="absolute inset-x-0 bottom-2 sm:bottom-3 h-3 sm:h-4 -z-0 rounded-sm"
                  style={{ background: 'hsl(45_80%_55%_/0.35)' }}
                  aria-hidden="true"
                />
                <span className="relative z-10 text-[hsl(45_80%_55%)]">
                  {branchName}
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
              className="mt-5 text-[hsl(150_20%_70%)] text-sm sm:text-base font-light italic"
            >
              {address}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.7 }}
              className="mt-7 flex items-center justify-center gap-3"
            >
              <span className="block h-px w-12 bg-[hsl(45_80%_55%/0.4)]" />
              <span className="text-[hsl(45_80%_55%/0.7)] text-xs font-semibold uppercase tracking-widest">
                Menú
              </span>
              <span className="block h-px w-12 bg-[hsl(45_80%_55%/0.4)]" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Curved bottom */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 z-[4] pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 50C40 38 80 62 120 48C160 34 200 58 240 44C280 30 320 54 360 40C400 26 440 50 480 36C520 22 560 46 600 32C640 18 680 42 720 28C760 14 800 38 840 24C880 10 920 34 960 20C1000 6 1040 30 1080 16C1120 2 1160 26 1200 12C1240 -2 1280 22 1320 8C1360 -6 1400 14 1440 0V100H0V50Z"
            fill="hsl(var(--ocheto-cream-50))"
          />
        </svg>
      </div>
    </section>
  );
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

export default function BranchMenu() {
  const { slug } = useParams<{ slug: string }>();
  const [activeSection, setActiveSection] = useState<string>('all');
  const { data: items, isLoading, error } = useBranchMenu(slug);

  const branchId = slug ? branchIdFromSlug(slug) : undefined;
  const branchName = slug ? (BRANCH_DISPLAY_NAMES[slug] ?? slug) : '';

  const products = useMemo(() => menuItemsToProducts(items ?? []), [items]);

  const sectionLabels = useMemo(() => {
    const labels = new Set<string>();
    (items ?? []).forEach((item) => labels.add(item.section_title));
    return ['all', ...Array.from(labels)];
  }, [items]);

  const filteredProducts = useMemo(() => {
    if (activeSection === 'all') return products;
    return products.filter((p) => p.tags.includes(activeSection));
  }, [products, activeSection]);

  const location = branchId ? LOCATIONS.find((l) => l.id === branchId) : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ocheto-cream-50">
        <div className="w-8 h-8 rounded-full border-[3px] border-ocheto-green-700/20 border-t-ocheto-green-700 animate-spin" />
      </div>
    );
  }

  if (error || !branchId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-ocheto-cream-50"
      >
        <div className="text-center">
          <h2 className="font-fraunces text-3xl text-ocheto-coffee-900 mb-2">Menú no encontrado</h2>
          <a href="/menu" className="text-ocheto-green-700 hover:underline">Ver menú general</a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="pt-20 min-h-screen bg-ocheto-cream-50"
    >
      <BranchHero branchName={branchName} />

      {/* Sticky filter bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
        className="sticky top-20 z-30 bg-ocheto-cream-50/85 backdrop-blur-xl border-b border-ocheto-coffee-900/8 shadow-[0_8px_32px_-12px_rgba(42,24,16,0.08)]"
      >
        <div className="container-ocheto py-4 sm:py-5">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
            {sectionLabels.map((label) => {
              const isActive = label === activeSection;
              return (
                <motion.button
                  key={label}
                  type="button"
                  onClick={() => setActiveSection(label)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  aria-pressed={isActive}
                  className={[
                    'group relative shrink-0 inline-flex items-center gap-1.5 sm:gap-2 rounded-full font-semibold transition-all duration-300',
                    'px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm whitespace-nowrap',
                    isActive
                      ? 'text-ocheto-cream-50 shadow-[0_8px_24px_-8px_hsla(var(--ocheto-green-900),0.55)]'
                      : 'text-ocheto-coffee-900 hover:text-ocheto-green-700',
                  ].join(' ')}
                  style={
                    isActive
                      ? {
                          background:
                            'linear-gradient(135deg, hsl(var(--ocheto-green-700)) 0%, hsl(var(--ocheto-green-600)) 100%)',
                        }
                      : {
                          background: 'transparent',
                          boxShadow: 'inset 0 0 0 1.5px hsl(var(--ocheto-coffee-900) / 0.15)',
                        }
                  }
                >
                  {isActive && (
                    <motion.span
                      layoutId="pill-glow-branch"
                      aria-hidden
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 50%, hsl(var(--ocheto-gold-500) / 0.35) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                  <span className="relative tracking-tight">
                    {label === 'all' ? 'Todos' : label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <section className="relative w-full bg-ocheto-cream-50 overflow-hidden">
        <div
          aria-hidden
          className="absolute top-40 -left-32 w-[420px] h-[420px] rounded-full bg-ocheto-caramel-500/8 blur-3xl pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute top-[60%] -right-32 w-[460px] h-[460px] rounded-full bg-ocheto-matcha-500/8 blur-3xl pointer-events-none"
        />

        <div className="relative container-ocheto py-14 sm:py-16 lg:py-20">
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-7"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                className="h-full"
              >
                <ProductCard
                  product={product}
                  variant="grid"
                  index={index}
                  showAddToCart={false}
                />
              </motion.div>
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative max-w-md mx-auto text-center py-16 sm:py-20 px-6 rounded-3xl border border-dashed border-ocheto-coffee-900/15 bg-white/40"
            >
              <p className="font-fraunces italic text-ocheto-coffee-900 text-2xl sm:text-3xl">
                Nada por aquí…
              </p>
              <p className="mt-3 text-ocheto-coffee-700/70 text-sm sm:text-base">
                Explora otra categoría.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact */}
      {location && (
        <section className="bg-ocheto-cream-50 border-t border-ocheto-coffee-900/8">
          <div className="container-ocheto py-10 sm:py-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-ocheto-coffee-700"
            >
              {location.phone && (
                <a
                  href={`tel:${location.phone}`}
                  className="flex items-center gap-2.5 hover:text-ocheto-green-700 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21V10.5m0 0h13.5m-13.5 0V3m13.5 7.5V3m0 7.5V21" />
                  </svg>
                  <span className="font-inter font-semibold text-sm">{location.phone}</span>
                </a>
              )}
              {location.whatsapp && (
                <a
                  href={location.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-ocheto-green-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4" strokeWidth={1.8} />
                  <span className="font-inter font-semibold text-sm">WhatsApp</span>
                </a>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
  );
}
