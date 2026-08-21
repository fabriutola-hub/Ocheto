import { motion } from 'framer-motion';
import Hero from '@/sections/Hero';
import FeaturedProducts from '@/sections/FeaturedProducts';
import Manifesto from '@/sections/Manifesto';
import Process from '@/sections/Process';
import MenuCategories from '@/sections/MenuCategories';
import Gallery from '@/sections/Gallery';
import Testimonials from '@/sections/Testimonials';
import Locations from '@/sections/Locations';
import Newsletter from '@/sections/Newsletter';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <FeaturedProducts />
      <Manifesto />
      <Process />
      <MenuCategories />
      <Gallery />
      <Testimonials />
      <Locations />
      <Newsletter />
    </motion.div>
  );
}
