import { useState, useEffect } from 'react';
import { setCookie, getCookie, applyCookieConsent } from '@/utils/cookies';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_KEY = 'securitel_cookie_consent';
const COOKIE_BANNER_KEY = 'securitel_cookie_banner_shown';

export const useCookies = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Toujours accepté
    analytics: false,
    marketing: false,
    preferences: false,
  });

  // Charger le consentement existant
  useEffect(() => {
    const savedConsent = getCookie(COOKIE_CONSENT_KEY);
    const bannerShown = getCookie(COOKIE_BANNER_KEY);
    
    if (savedConsent) {
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);
      applyCookieConsent(parsedConsent);
    }
    
    // Afficher la bannière si pas encore vue
    if (!bannerShown) {
      setShowBanner(true);
    }
  }, []);

  // Sauvegarder le consentement
  const saveConsent = (newConsent: CookieConsent) => {
    const consentToSave = { ...newConsent, necessary: true };
    setConsent(consentToSave);
    
    // Sauvegarder dans les cookies avec expiration de 365 jours
    setCookie(COOKIE_CONSENT_KEY, JSON.stringify(consentToSave), { 
      expires: 365,
      path: '/',
      sameSite: 'lax'
    });
    setCookie(COOKIE_BANNER_KEY, 'true', { 
      expires: 365,
      path: '/',
      sameSite: 'lax'
    });
    
    setShowBanner(false);
    
    // Appliquer les cookies selon le consentement
    applyCookieConsent(consentToSave);
  };

  // Accepter tous les cookies
  const acceptAll = () => {
    const allAccepted: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveConsent(allAccepted);
  };

  // Refuser tous les cookies non nécessaires
  const rejectAll = () => {
    const onlyNecessary: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    saveConsent(onlyNecessary);
  };

  // Fermer la bannière sans sauvegarder
  const closeBanner = () => {
    setShowBanner(false);
    setCookie(COOKIE_BANNER_KEY, 'true', { 
      expires: 30,
      path: '/',
      sameSite: 'lax'
    });
  };



  // Réinitialiser les paramètres de cookies
  const resetCookies = () => {
    // Supprimer les cookies de consentement
    setCookie(COOKIE_CONSENT_KEY, '', { expires: -1, path: '/' });
    setCookie(COOKIE_BANNER_KEY, '', { expires: -1, path: '/' });
    
    setShowBanner(true);
    setConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  return {
    showBanner,
    consent,
    acceptAll,
    rejectAll,
    saveConsent,
    closeBanner,
    resetCookies,
    setShowBanner,
  };
};