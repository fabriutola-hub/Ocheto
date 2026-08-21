import { useState, useEffect } from 'react';

export function useScrollPosition() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrolled = window.scrollY > 30;
      setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { isScrolled };
}
