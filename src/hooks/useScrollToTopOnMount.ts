import { useEffect } from 'react';
import { scrollToTopInstant, scrollToTopSmooth, scrollToElement } from '@/utils/scrollUtils';

/**
 * Hook pour faire défiler vers le haut lors du montage du composant
 * Utilise un scroll instantané pour éviter les problèmes de timing
 */
export const useScrollToTopOnMount = (instant: boolean = true) => {
  useEffect(() => {
    if (instant) {
      scrollToTopInstant();
    } else {
      scrollToTopSmooth();
    }
  }, [instant]);
};

/**
 * Hook pour faire défiler vers un élément spécifique
 */
export const useScrollToElement = (elementId: string, offset: number = 0) => {
  const scrollToElementHandler = () => {
    scrollToElement(elementId, offset);
  };

  return scrollToElementHandler;
};