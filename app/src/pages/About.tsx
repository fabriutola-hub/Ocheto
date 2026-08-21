import { EASE } from '@/shared/motion';
import { motion } from 'framer-motion';
import AboutHero from '@/sections/about/AboutHero';
import AboutStory from '@/sections/about/AboutStory';
import AboutValues from '@/sections/about/AboutValues';
import AboutTeam from '@/sections/about/AboutTeam';
import AboutCTA from '@/sections/about/AboutCTA';

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="pt-24"
    >
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
      <AboutCTA />
    </motion.div>
  );
}
