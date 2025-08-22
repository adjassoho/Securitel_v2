import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToTopInstant } from '@/utils/scrollUtils';

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll instantané vers le haut à chaque changement de route
    // Utilisation d'un scroll instantané pour éviter les problèmes de timing
    scrollToTopInstant();
    
    // Alternative avec délai si nécessaire
    // const timer = setTimeout(() => {
    //   scrollToTopSmooth();
    // }, 50);
    // return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTopOnRouteChange;