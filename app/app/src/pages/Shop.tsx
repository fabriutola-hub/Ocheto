import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router';
import ShopHero from '@/sections/shop/ShopHero';
import ShopGrid from '@/sections/shop/ShopGrid';
import ShopStory from '@/sections/shop/ShopStory';
import ShopShipping from '@/sections/shop/ShopShipping';

export default function Shop() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.setTimeout(() => {
        window.scrollTo({ top, behavior: 'smooth' });
      }, 120);
    }
  }, [hash]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="pt-24"
    >
      <ShopHero />
      <ShopGrid />
      <ShopStory />
      <ShopShipping />
    </motion.div>
  );
}
