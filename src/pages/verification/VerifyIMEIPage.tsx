import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { phoneService } from '@/services/api';
import { Search, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerifyIMEIPage = () => {
  const [imei, setImei] = useState('');
  const [result, setResult] = useState<any>(null);

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
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Vérifier un IMEI</h1>

      <div className="card mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="imei" className="label">
              Numéro IMEI
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="imei"
                value={imei}
                onChange={(e) => setImei(e.target.value.replace(/\D/g, ''))}
                className="input pl-10"
                placeholder="Entrez les 15 chiffres de l'IMEI"
                maxLength={15}
                pattern="[0-9]{15}"
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              L'IMEI se trouve généralement dans les paramètres du téléphone ou en composant *#06#
            </p>
          </div>

          <button
            type="submit"
            disabled={imei.length !== 15 || verifyMutation.isPending}
            className="btn-primary w-full"
          >
            {verifyMutation.isPending ? 'Vérification en cours...' : 'Vérifier'}
          </button>
        </form>
      </div>

      {/* Résultat de la vérification */}
      {result && (
        <div className="card">
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
                    <Link to="/report/found" className="btn-primary">
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
                  <Link to="/report/suspicious" className="btn-outline mt-3">
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
              }}
              className="btn-outline w-full"
            >
              Effectuer une nouvelle vérification
            </button>
          </div>
        </div>
      )}

      {/* Informations supplémentaires */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Comment trouver l'IMEI ?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Composez *#06# sur le clavier</li>
            <li>• Paramètres → À propos du téléphone</li>
            <li>• Sur la boîte d'origine</li>
            <li>• Sous la batterie (anciens modèles)</li>
          </ul>
        </div>

        <div className="card">
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
  );
};

export default VerifyIMEIPage;
