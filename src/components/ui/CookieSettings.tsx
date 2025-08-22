import { useState } from 'react';
import { Cookie, Shield, BarChart3, Target, User, RefreshCw } from 'lucide-react';
import { useCookies, CookieConsent } from '@/hooks/useCookies';

const CookieSettings = () => {
  const { consent, saveConsent, resetCookies } = useCookies();
  const [tempConsent, setTempConsent] = useState<CookieConsent>(consent);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    saveConsent(tempConsent);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    resetCookies();
    setTempConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const cookieTypes = [
    {
      key: 'necessary' as keyof CookieConsent,
      title: 'Cookies nécessaires',
      description: 'Ces cookies sont essentiels au bon fonctionnement du site. Ils permettent la navigation, l\'authentification et les fonctionnalités de base. Ils ne peuvent pas être désactivés.',
      icon: Shield,
      required: true,
      examples: 'Session utilisateur, préférences de langue, panier d\'achat',
    },
    {
      key: 'analytics' as keyof CookieConsent,
      title: 'Cookies analytiques',
      description: 'Ces cookies nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant et rapportant des informations de manière anonyme.',
      icon: BarChart3,
      required: false,
      examples: 'Google Analytics, statistiques de visite, analyse du comportement',
    },
    {
      key: 'preferences' as keyof CookieConsent,
      title: 'Cookies de préférences',
      description: 'Ces cookies permettent au site de mémoriser vos choix et de personnaliser votre expérience pour vous offrir des fonctionnalités améliorées.',
      icon: User,
      required: false,
      examples: 'Thème sombre/clair, préférences d\'affichage, paramètres personnalisés',
    },
    {
      key: 'marketing' as keyof CookieConsent,
      title: 'Cookies marketing',
      description: 'Ces cookies sont utilisés pour suivre les visiteurs sur les sites web. L\'intention est d\'afficher des publicités qui sont pertinentes et engageantes.',
      icon: Target,
      required: false,
      examples: 'Publicités ciblées, remarketing, pixels de conversion',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center px-4 py-2 mb-4 text-sm font-medium text-primary-700 bg-primary-100 rounded-full">
          <Cookie className="w-4 h-4 mr-2" />
          Gestion des cookies
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Paramètres des cookies
        </h1>
        <p className="text-lg text-gray-600">
          Contrôlez les cookies utilisés sur SecuriTel selon vos préférences
        </p>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center font-medium">
            ✅ Vos préférences de cookies ont été sauvegardées avec succès !
          </p>
        </div>
      )}

      {/* Cookie types */}
      <div className="space-y-6 mb-8">
        {cookieTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.key}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className={`p-3 rounded-lg ${
                    type.required 
                      ? 'bg-gray-100' 
                      : tempConsent[type.key] 
                        ? 'bg-primary-100' 
                        : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      type.required 
                        ? 'text-gray-600' 
                        : tempConsent[type.key] 
                          ? 'text-primary-600' 
                          : 'text-gray-400'
                    }`} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {type.title}
                    </h3>
                    <div className="flex items-center">
                      {type.required ? (
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                          Toujours actif
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
                          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {type.description}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">
                      <strong>Exemples :</strong> {type.examples}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Sauvegarder vos préférences
            </h3>
            <p className="text-sm text-gray-600">
              Vos choix seront appliqués immédiatement et mémorisés pour vos prochaines visites
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
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
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Pour plus d'informations, consultez notre{' '}
          <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
            Politique de Confidentialité
          </a>
        </p>
      </div>
    </div>
  );
};

export default CookieSettings;