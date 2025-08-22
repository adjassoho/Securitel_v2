/**
 * Utilitaires pour la gestion du scroll
 */

/**
 * Scroll vers le haut de manière instantanée
 */
export const scrollToTopInstant = (): void => {
  window.scrollTo(0, 0);
};

/**
 * Scroll vers le haut de manière fluide
 */
export const scrollToTopSmooth = (): void => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};

/**
 * Scroll vers un élément spécifique
 */
export const scrollToElement = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Scroll vers une position spécifique
 */
export const scrollToPosition = (top: number, behavior: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({
    top,
    behavior
  });
};

/**
 * Obtenir la position de scroll actuelle
 */
export const getScrollPosition = (): { x: number; y: number } => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  };
};

/**
 * Vérifier si on est en haut de la page
 */
export const isAtTop = (threshold: number = 0): boolean => {
  return getScrollPosition().y <= threshold;
};

/**
 * Vérifier si on est en bas de la page
 */
export const isAtBottom = (threshold: number = 100): boolean => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = getScrollPosition().y;
  
  return scrollTop + windowHeight >= documentHeight - threshold;
};

/**
 * Sauvegarder la position de scroll
 */
export const saveScrollPosition = (key: string): void => {
  const position = getScrollPosition();
  sessionStorage.setItem(key, JSON.stringify(position));
};

/**
 * Restaurer la position de scroll
 */
export const restoreScrollPosition = (key: string): void => {
  const savedPosition = sessionStorage.getItem(key);
  if (savedPosition) {
    const position = JSON.parse(savedPosition);
    window.scrollTo(position.x, position.y);
    sessionStorage.removeItem(key);
  }
};