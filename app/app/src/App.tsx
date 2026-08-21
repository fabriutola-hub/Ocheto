import { Routes, Route, useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import Shop from '@/pages/Shop';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import CartDrawer from '@/components/CartDrawer';
import Navbar from '@/sections/Navbar';
import Footer from '@/sections/Footer';
import LoadingScreen from '@/sections/LoadingScreen';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    return !sessionStorage.getItem('ocheto-visited');
  });
  const location = useLocation();

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('ocheto-visited', '1');
  };

  // Hide footer on home if loading (keeps flow consistent)
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
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/tienda" element={<Shop />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isLoading && location.pathname !== '/' && <Footer />}
      {!isLoading && location.pathname === '/' && <Footer />}

      <CartDrawer />
    </>
  );
}

export default App;
