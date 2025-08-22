import { useState } from 'react';
import { X, Cookie, Settings, Shield, BarChart3, Target, User } from 'lucide-react';
import { useCookies, CookieConsent } from '@/hooks/useCookies';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const { showBanner, consent, acceptAll, rejectAll, saveConsent, closeBanner } = useCookies();
  const [showSettings, setShowSettings] = useState(false);
  const [tempConsent, setTempConsent] = useState<CookieConsent>(consent);

  if (!showBanner) return null;

  const handleSaveSettings = () => {
    saveConsent(tempConsent);
    setShowSettings(false);
  };

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookieConsent,
      title: 'Cookies nécessaires',
      description: 'Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.',
      icon: Shield,
      required: true,
    },
    {
      key: 'analytics' as keyof CookieConsent,
      title: 'Cookies analytiques',
      description: 'Ces cookies nous aident à comprendre comment vous utilisez notre site pour l\'améliorer.',
      icon: BarChart3,
      required: false,
    },
    {
      key: 'preferences' as keyof CookieConsent,
      title: 'Cookies de préférences',
      description: 'Ces cookies mémorisent vos préférences et personnalisent votre expérience.',
      icon: User,
      required: false,
    },
    {
      key: 'marketing' as keyof CookieConsent,
      title: 'Cookies marketing',
      description: 'Ces cookies sont utilisés pour vous proposer des publicités pertinentes.',
      icon: Target,
      required: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
      <div className="w-full max-w-4xl pointer-events-auto">
        {/* Bannière principale */}
        {!showSettings && (
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 animate-slideUp">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Cookie className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Nous utilisons des cookies
                  </h3>
                  <p className="text-sm text-gray-600">
                    SecuriTel utilise des cookies pour améliorer votre expérience
                  </p>
                </div>
              </div>
              <button
                onClick={closeBanner}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Nous utilisons des cookies pour personnaliser le contenu, analyser notre trafic et 
              améliorer nos services. Certains cookies sont nécessaires au fonctionnement du site, 
              d'autres nécessitent votre consentement.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2 text-sm">
                <Link 
                  to="/privacy" 
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Politique de confidentialité
                </Link>
                <span className="text-gray-400">•</span>
                <Link 
                  to="/terms" 
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  CGU
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Refuser tout
                </button>
                <button
                  onClick={acceptAll}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  Accepter tout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Panneau de paramètres détaillés */}
        {showSettings && (
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-h-[80vh] overflow-y-auto animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Settings className="h-6 w-6 text-primary-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Paramètres des cookies
                </h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Choisissez les types de cookies que vous souhaitez autoriser. Vous pouvez modifier 
              ces paramètres à tout moment.
            </p>

            <div className="space-y-4 mb-6">
              {cookieTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.key}
                    className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">
                          {type.title}
                        </h4>
                        <div className="flex items-center">
                          {type.required ? (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Requis
                            </span>
                          ) : (
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={tempConsent[type.key]}
                                onChange={(e) =>
                                  setTempConsent({
                                    ...tempConsent,
                                    [type.key]: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                            </label>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  setTempConsent({
                    necessary: true,
                    analytics: false,
                    marketing: false,
                    preferences: false,
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Refuser tout
              </button>
              <button
                onClick={() => {
                  setTempConsent({
                    necessary: true,
                    analytics: true,
                    marketing: true,
                    preferences: true,
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Accepter tout
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;