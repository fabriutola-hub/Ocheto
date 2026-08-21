import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import AppRoutes from '@/app/routes';
import CartDrawer from '@/components/layout/CartDrawer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingScreen from '@/components/layout/LoadingScreen';
import ScrollToTop from '@/components/layout/ScrollToTop';

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('ocheto-visited');
  });

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    sessionStorage.setItem('ocheto-visited', '1');
  }, []);

  useEffect(() => {
    if (!isLoading) {
      document.body.classList.remove('no-scroll');
    } else {
      document.body.classList.add('no-scroll');
    }
  }, [isLoading]);

  return (
    <>
      <ScrollToTop />
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      <Navbar />

      <main className={isLoading ? 'h-screen overflow-hidden' : 'min-h-screen'}>
        <AppRoutes />
      </main>

      {!isLoading && <Footer />}

      <CartDrawer />
    </>
  );
}

export default App;
