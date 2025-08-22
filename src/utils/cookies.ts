// Utilitaires pour la gestion des cookies

export interface CookieOptions {
  expires?: Date | number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Définir un cookie
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.expires) {
    if (typeof options.expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
  }

  if (options.path) {
    cookieString += `; path=${options.path}`;
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  document.cookie = cookieString;
};

/**
 * Obtenir un cookie
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }

  return null;
};

/**
 * Supprimer un cookie
 */
export const deleteCookie = (name: string, path: string = '/', domain?: string): void => {
  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
  
  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  document.cookie = cookieString;
};

/**
 * Vérifier si les cookies sont activés
 */
export const areCookiesEnabled = (): boolean => {
  try {
    setCookie('test_cookie', 'test', { expires: 1 });
    const enabled = getCookie('test_cookie') === 'test';
    deleteCookie('test_cookie');
    return enabled;
  } catch {
    return false;
  }
};

/**
 * Obtenir tous les cookies
 */
export const getAllCookies = (): Record<string, string> => {
  const cookies: Record<string, string> = {};
  
  if (document.cookie) {
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
  }

  return cookies;
};

/**
 * Supprimer tous les cookies (sauf les nécessaires)
 */
export const clearAllCookies = (exceptions: string[] = []): void => {
  const cookies = getAllCookies();
  
  Object.keys(cookies).forEach(name => {
    if (!exceptions.includes(name)) {
      deleteCookie(name);
    }
  });
};

/**
 * Cookies nécessaires qui ne peuvent pas être supprimés
 */
export const NECESSARY_COOKIES = [
  'securitel_cookie_consent',
  'securitel_cookie_banner_shown',
  'auth_token',
  'session_id',
  'csrf_token'
];

/**
 * Appliquer les paramètres de consentement des cookies
 */
export const applyCookieConsent = (consent: {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}): void => {
  // Supprimer les cookies non autorisés
  const allCookies = getAllCookies();
  
  Object.keys(allCookies).forEach(cookieName => {
    // Cookies analytiques
    if (!consent.analytics && isAnalyticsCookie(cookieName)) {
      deleteCookie(cookieName);
    }
    
    // Cookies marketing
    if (!consent.marketing && isMarketingCookie(cookieName)) {
      deleteCookie(cookieName);
    }
    
    // Cookies de préférences
    if (!consent.preferences && isPreferencesCookie(cookieName)) {
      deleteCookie(cookieName);
    }
  });

  // Configurer les services tiers selon le consentement
  if (consent.analytics) {
    enableAnalytics();
  } else {
    disableAnalytics();
  }

  if (consent.marketing) {
    enableMarketing();
  } else {
    disableMarketing();
  }
};

/**
 * Vérifier si un cookie est analytique
 */
const isAnalyticsCookie = (name: string): boolean => {
  const analyticsCookies = ['_ga', '_gid', '_gat', '_gtag', 'analytics'];
  return analyticsCookies.some(pattern => name.includes(pattern));
};

/**
 * Vérifier si un cookie est marketing
 */
const isMarketingCookie = (name: string): boolean => {
  const marketingCookies = ['_fbp', '_fbc', 'marketing', 'ads', 'pixel'];
  return marketingCookies.some(pattern => name.includes(pattern));
};

/**
 * Vérifier si un cookie est de préférences
 */
const isPreferencesCookie = (name: string): boolean => {
  const preferencesCookies = ['theme', 'language', 'preferences', 'settings'];
  return preferencesCookies.some(pattern => name.includes(pattern));
};

/**
 * Activer Google Analytics
 */
const enableAnalytics = (): void => {
  // Exemple d'activation de Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
  }
  console.log('Analytics enabled');
};

/**
 * Désactiver Google Analytics
 */
const disableAnalytics = (): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }
  console.log('Analytics disabled');
};

/**
 * Activer les cookies marketing
 */
const enableMarketing = (): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: 'granted'
    });
  }
  console.log('Marketing cookies enabled');
};

/**
 * Désactiver les cookies marketing
 */
const disableMarketing = (): void => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: 'denied'
    });
  }
  console.log('Marketing cookies disabled');
};