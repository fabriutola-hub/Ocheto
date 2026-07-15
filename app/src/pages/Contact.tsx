import { motion } from 'framer-motion';
import ContactHero from '@/sections/contact/ContactHero';
import ContactLocations from '@/sections/contact/ContactLocations';
import ContactForm from '@/sections/contact/ContactForm';
import ContactFAQ from '@/sections/contact/ContactFAQ';

export default function Contact() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="pt-24"
    >
      <ContactHero />
      <ContactLocations />
      <ContactForm />
      <ContactFAQ />
    </motion.div>
  );
}
