import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { phoneService } from '@/services/api';
import { Search, AlertTriangle, CheckCircle, XCircle, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerifyIMEIPage = () => {
  const [imei, setImei] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isValid, setIsValid] = useState(false);

  // Validation stricte IMEI
  const validateIMEI = (imei: string) => {
    const cleanIMEI = imei.replace(/\D/g, '');
    return cleanIMEI.length === 15 && /^[0-9]{15}$/.test(cleanIMEI);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ne garder que les chiffres
    const cleanValue = value.replace(/\D/g, '');
    
    // Limiter à 15 caractères
    if (cleanValue.length <= 15) {
      setImei(cleanValue);
      setIsValid(validateIMEI(cleanValue));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Empêcher la saisie de lettres et caractères spéciaux
    if (!/[0-9]/.test(e.key) && 
        !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    const cleanData = pasteData.replace(/\D/g, '').slice(0, 15);
    setImei(cleanData);
    setIsValid(validateIMEI(cleanData));
  };

  const verifyMutation = useMutation({
    mutationFn: (imei: string) => phoneService.verifyIMEI(imei),
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imei.length === 15) {
      verifyMutation.mutate(imei);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'legitimate':
        return 'text-green-600';
      case 'stolen':
        return 'text-red-600';
      case 'lost':
        return 'text-orange-600';
      case 'recovered':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'legitimate':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'stolen':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'lost':
        return <AlertTriangle className="h-8 w-8 text-orange-500" />;
      case 'recovered':
        return <img src="/images/logo.png" alt="SecuriTel Logo" className="h-8 w-8 mx-auto" />;
      default:
        return <img src="/images/logo.png" alt="SecuriTel Logo" className="h-8 w-8 mx-auto opacity-50" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'legitimate':
        return {
          title: 'Téléphone sécurisé',
          message: 'Ce téléphone est enregistré et protégé dans notre base de données.',
        };
      case 'stolen':
        return {
          title: 'Téléphone volé !',
          message: 'ATTENTION : Ce téléphone a été déclaré volé. N\'achetez pas cet appareil.',
        };
      case 'lost':
        return {
          title: 'Téléphone perdu',
          message: 'Ce téléphone a été déclaré perdu. Si vous l\'avez trouvé, veuillez le signaler.',
        };
      case 'recovered':
        return {
          title: 'Téléphone récupéré',
          message: 'Ce téléphone a été récupéré par son propriétaire légitime.',
        };
      default:
        return {
          title: 'Statut inconnu',
          message: 'Le statut de ce téléphone n\'est pas disponible.',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      
      <div className="relative min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 mx-auto w-20 h-20 flex items-center justify-center">
                <img src="/images/logo.png" alt="SecuriTel Logo" className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Vérifier un IMEI
            </h1>
            <p className="text-lg lg:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Vérifiez le statut d'un téléphone avant l'achat pour éviter les mauvaises surprises
            </p>
          </div>

          {/* Formulaire principal */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/90 flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-emerald-300" />
                  Numéro IMEI
                  <span className="text-red-400 ml-1">*</span>
                </label>
                
                <div className="relative">
                  <input
                    type="text"
                    id="imei"
                    value={imei}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    className={`
                      w-full px-16 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15 font-mono text-lg tracking-widest text-center
                      ${
                        imei.length > 0
                          ? isValid && imei.length === 15
                            ? 'border-emerald-400 ring-4 ring-emerald-400/20'
                            : 'border-red-400 ring-4 ring-red-400/20'
                          : ''
                      }
                    `}
                    placeholder="Entrez les 15 chiffres de l'IMEI"
                    maxLength={15}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  
                  {/* Icône de recherche */}
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/60" />
                  </div>
                  
                  {/* Indicateur de validation */}
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    {imei.length > 0 && (
                      <>
                        {isValid && imei.length === 15 ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Compteur de caractères */}
                  <div className="absolute -bottom-6 right-0 text-sm font-medium">
                    <span className={`
                      ${imei.length === 15 
                        ? 'text-emerald-400' 
                        : imei.length > 0 
                          ? 'text-cyan-400' 
                          : 'text-white/60'
                      }
                    `}>
                      {imei.length}/15
                    </span>
                  </div>
                </div>
                
                {/* Messages d'aide */}
                <div className="space-y-2">
                  {imei.length > 0 && imei.length < 15 && (
                    <p className="text-sm text-cyan-300 flex items-center">
                      <span className="w-1 h-1 bg-cyan-300 rounded-full mr-2"></span>
                      Entrez exactement 15 chiffres (encore {15 - imei.length} caractères)
                    </p>
                  )}
                  
                  {imei.length === 15 && isValid && (
                    <p className="text-sm text-emerald-300 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      IMEI valide
                    </p>
                  )}
                  
                  {imei.length === 0 && (
                    <p className="text-sm text-white/70">
                      L'IMEI se trouve généralement dans les paramètres du téléphone ou en composant *#06#
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isValid || imei.length !== 15 || verifyMutation.isPending}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {verifyMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Vérification en cours...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Vérifier l'IMEI</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Résultat de la vérification */}
          {result && (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl mb-8">
              <div className="text-center">
                {result.found ? (
                  <>
                    <div className="mb-4">{getStatusIcon(result.phone.status)}</div>
                    <h2 className={`text-2xl font-bold mb-2 ${getStatusColor(result.phone.status)}`}>
                      {getStatusMessage(result.phone.status).title}
                    </h2>
                    <p className="text-white/80 mb-6">
                      {getStatusMessage(result.phone.status).message}
                    </p>

                    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-left space-y-3 border border-white/10">
                      <div>
                        <span className="font-medium text-white/90">IMEI:</span>{' '}
                        <span className="text-white font-mono">{result.phone.imei}</span>
                      </div>
                      <div>
                        <span className="font-medium text-white/90">Numéro de série:</span>{' '}
                        <span className="text-white font-mono">{result.phone.serial_number}</span>
                      </div>
                      <div>
                        <span className="font-medium text-white/90">Statut:</span>{' '}
                        <span className={`font-semibold ${getStatusColor(result.phone.status)}`}>
                          {result.phone.status === 'legitimate' && 'Légitime'}
                          {result.phone.status === 'stolen' && 'Volé'}
                          {result.phone.status === 'lost' && 'Perdu'}
                          {result.phone.status === 'recovered' && 'Récupéré'}
                        </span>
                      </div>
                    </div>

                    {result.phone.status === 'stolen' && (
                      <div className="mt-6 p-4 bg-red-500/20 backdrop-blur-lg border border-red-500/30 rounded-2xl">
                        <p className="text-sm text-red-200">
                          Si vous êtes en possession de ce téléphone, veuillez le remettre aux autorités compétentes.
                        </p>
                      </div>
                    )}

                    {result.phone.status === 'lost' && (
                      <div className="mt-6">
                        <Link to="/report/found" className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
                          Déclarer avoir trouvé ce téléphone
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-white">
                      Téléphone non trouvé
                    </h2>
                    <p className="text-white/80 mb-6">
                      Ce téléphone n'est pas enregistré dans notre base de données. 
                      Il pourrait ne pas être protégé contre le vol.
                    </p>
                    <div className="space-y-4">
                      <p className="text-sm text-white/70">
                        Recommandations :
                      </p>
                      <ul className="text-left text-sm text-white/80 space-y-2 bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                        <li>• Demandez au vendeur des preuves d'achat</li>
                        <li>• Vérifiez l'état du téléphone avec le vendeur</li>
                        <li>• Soyez prudent lors de l'achat</li>
                      </ul>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-2xl">
                      <p className="text-sm text-yellow-200 mb-3">
                        Si vous soupçonnez que ce téléphone pourrait être volé, vous pouvez le signaler.
                      </p>
                      <Link to="/report/suspicious" className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-white/20 backdrop-blur-lg border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300">
                        Signaler comme suspect
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <button
                  onClick={() => {
                    setResult(null);
                    setImei('');
                    setIsValid(false);
                  }}
                  className="w-full px-8 py-4 text-lg font-semibold text-white bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl hover:bg-white/30 transition-all duration-300"
                >
                  Effectuer une nouvelle vérification
                </button>
              </div>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-emerald-300" />
                Comment trouver l'IMEI ?
              </h3>
              <ul className="text-sm text-white/80 space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Composez *#06# sur le clavier
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Paramètres → À propos du téléphone
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Sur la boîte d'origine
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Sous la batterie (anciens modèles)
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-lg">
              <h3 className="font-semibold text-white mb-4 flex items-center">
                <img src="/images/logo.png" alt="SecuriTel Logo" className="w-5 h-5 mr-2" />
                Pourquoi vérifier ?
              </h3>
              <ul className="text-sm text-white/80 space-y-3">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                  Éviter d'acheter un téléphone volé
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                  Vérifier le statut avant l'achat
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                  Protéger votre investissement
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-teal-400 rounded-full mr-3"></span>
                  Contribuer à réduire le vol
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyIMEIPage;
