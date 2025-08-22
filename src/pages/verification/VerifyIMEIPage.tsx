import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { phoneService } from '@/services/api';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, Smartphone } from 'lucide-react';
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
        return <Shield className="h-8 w-8 text-blue-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-500" />;
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
    <div className="form-container min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Vérifier un IMEI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vérifiez le statut d'un téléphone avant l'achat pour éviter les mauvaises surprises
          </p>
        </div>

        <div className="form-section">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="enhanced-label">
                <Smartphone className="w-5 h-5 mr-2 text-blue-600" />
                Numéro IMEI
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
                    enhanced-input font-mono text-lg tracking-widest text-center pr-16
                    ${
                      imei.length > 0
                        ? isValid && imei.length === 15
                          ? 'success-input'
                          : 'error-input'
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
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                
                {/* Indicateur de validation */}
                <div className="absolute inset-y-0 right-4 flex items-center">
                  {imei.length > 0 && (
                    <>
                      {isValid && imei.length === 15 ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </>
                  )}
                </div>
                
                {/* Compteur de caractères */}
                <div className="absolute -bottom-6 right-0 text-sm font-medium">
                  <span className={`
                    ${imei.length === 15 
                      ? 'text-green-600' 
                      : imei.length > 0 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }
                  `}>
                    {imei.length}/15
                  </span>
                </div>
              </div>
              
              {/* Messages d'aide */}
              <div className="space-y-2">
                {imei.length > 0 && imei.length < 15 && (
                  <p className="field-help text-blue-600">
                    Entrez exactement 15 chiffres (encore {15 - imei.length} caractères)
                  </p>
                )}
                
                {imei.length === 15 && isValid && (
                  <p className="field-success">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    IMEI valide
                  </p>
                )}
                
                {imei.length === 0 && (
                  <p className="field-help">
                    L'IMEI se trouve généralement dans les paramètres du téléphone ou en composant *#06#
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!isValid || imei.length !== 15 || verifyMutation.isPending}
              className="btn-form-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Vérification en cours...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-3" />
                  Vérifier l'IMEI
                </>
              )}
            </button>
          </form>
        </div>

        {/* Résultat de la vérification */}
        {result && (
          <div className="form-section">
            <div className="text-center">
              {result.found ? (
                <>
                  <div className="mb-4">{getStatusIcon(result.phone.status)}</div>
                  <h2 className={`text-2xl font-bold mb-2 ${getStatusColor(result.phone.status)}`}>
                    {getStatusMessage(result.phone.status).title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {getStatusMessage(result.phone.status).message}
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">IMEI:</span>{' '}
                      <span className="text-gray-900">{result.phone.imei}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Numéro de série:</span>{' '}
                      <span className="text-gray-900">{result.phone.serial_number}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Statut:</span>{' '}
                      <span className={`font-semibold ${getStatusColor(result.phone.status)}`}>
                        {result.phone.status === 'legitimate' && 'Légitime'}
                        {result.phone.status === 'stolen' && 'Volé'}
                        {result.phone.status === 'lost' && 'Perdu'}
                        {result.phone.status === 'recovered' && 'Récupéré'}
                      </span>
                    </div>
                  </div>

                  {result.phone.status === 'stolen' && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        Si vous êtes en possession de ce téléphone, veuillez le remettre aux autorités compétentes.
                      </p>
                    </div>
                  )}

                  {result.phone.status === 'lost' && (
                    <div className="mt-6">
                      <Link to="/report/found" className="btn-form-primary">
                        Déclarer avoir trouvé ce téléphone
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">
                    Téléphone non trouvé
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Ce téléphone n'est pas enregistré dans notre base de données. 
                    Il pourrait ne pas être protégé contre le vol.
                  </p>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Recommandations :
                    </p>
                    <ul className="text-left text-sm text-gray-600 space-y-2">
                      <li>• Demandez au vendeur des preuves d'achat</li>
                      <li>• Vérifiez l'état du téléphone avec le vendeur</li>
                      <li>• Soyez prudent lors de l'achat</li>
                    </ul>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Si vous soupçonnez que ce téléphone pourrait être volé, vous pouvez le signaler.
                    </p>
                    <Link to="/report/suspicious" className="btn-form-secondary mt-3">
                      Signaler comme suspect
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 pt-6 border-t">
              <button
                onClick={() => {
                  setResult(null);
                  setImei('');
                  setIsValid(false);
                }}
                className="btn-form-secondary w-full"
              >
                Effectuer une nouvelle vérification
              </button>
            </div>
          </div>
        )}

        {/* Informations supplémentaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-section">
            <h3 className="font-semibold text-gray-900 mb-2">Comment trouver l'IMEI ?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Composez *#06# sur le clavier</li>
              <li>• Paramètres → À propos du téléphone</li>
              <li>• Sur la boîte d'origine</li>
              <li>• Sous la batterie (anciens modèles)</li>
            </ul>
          </div>

          <div className="form-section">
            <h3 className="font-semibold text-gray-900 mb-2">Pourquoi vérifier ?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Éviter d'acheter un téléphone volé</li>
              <li>• Vérifier le statut avant l'achat</li>
              <li>• Protéger votre investissement</li>
              <li>• Contribuer à réduire le vol</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyIMEIPage;
