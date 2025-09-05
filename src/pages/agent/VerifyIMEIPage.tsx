import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import type { IMEIVerificationResult } from '@/types';
import {
  Search,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  Shield,
  RefreshCw,
  Copy,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyIMEIPage = () => {
  const [imei, setImei] = useState('');
  const [verificationResult, setVerificationResult] = useState<IMEIVerificationResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const verifyIMeIMutation = useMutation({
    mutationFn: agentService.verifyIMEI,
    onSuccess: (data) => {
      setVerificationResult(data);
      setIsSearching(false);
      
      // Alerte automatique si IMEI volé/perdu
      if (data.status === 'stolen' || data.status === 'lost') {
        toast.error(`⚠️ ALERTE: IMEI ${data.status === 'stolen' ? 'VOLÉ' : 'PERDU'} détecté !`, {
          duration: 10000,
        });
      } else if (data.status === 'unknown') {
        toast('IMEI non enregistré - Proposer l\'enregistrement', { icon: 'ℹ️' });
      } else {
        toast.success('IMEI vérifié avec succès');
      }
    },
    onError: (error: any) => {
      setIsSearching(false);
      toast.error(error.response?.data?.message || 'Erreur lors de la vérification');
    },
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imei.trim()) {
      toast.error('Veuillez saisir un IMEI');
      return;
    }

    if (imei.length < 15) {
      toast.error('L\'IMEI doit contenir au moins 15 chiffres');
      return;
    }

    setIsSearching(true);
    verifyIMeIMutation.mutate(imei);
  };

  const handleRegisterNew = () => {
    // Rediriger vers la page d'enregistrement
    window.location.href = '/agent/register-phone';
  };

  const copyIMEI = () => {
    navigator.clipboard.writeText(imei);
    toast.success('IMEI copié dans le presse-papiers');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'stolen':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'lost':
        return <AlertTriangle className="h-8 w-8 text-orange-500" />;
      case 'unknown':
        return <Clock className="h-8 w-8 text-gray-500" />;
      default:
        return <Shield className="h-8 w-8 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'stolen':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'lost':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'unknown':
        return 'bg-gray-50 border-gray-200 text-gray-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Téléphone Valide';
      case 'stolen':
        return 'Téléphone Volé';
      case 'lost':
        return 'Téléphone Perdu';
      case 'unknown':
        return 'IMEI Inconnu';
      default:
        return 'Statut Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vérification IMEI Avant Achat</h1>
        <p className="text-gray-600">
          Vérifiez instantanément le statut d'un téléphone avant l'achat
        </p>
      </div>

      {/* Formulaire de vérification */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro IMEI
            </label>
            <div className="relative">
              <input
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value.replace(/\D/g, ''))}
                placeholder="Entrez le numéro IMEI (15 chiffres minimum)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                maxLength={20}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Smartphone className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Saisissez uniquement les chiffres (15-20 caractères)
            </p>
          </div>

          <button
            type="submit"
            disabled={isSearching || !imei.trim()}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSearching ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Vérification en cours...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Vérifier l'IMEI
              </>
            )}
          </button>
        </form>
      </div>

      {/* Résultat de la vérification */}
      {verificationResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Résultat de la Vérification</h2>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(verificationResult.status)}`}>
                {getStatusText(verificationResult.status)}
              </span>
              {getStatusIcon(verificationResult.status)}
            </div>
          </div>

          {/* Informations du téléphone */}
          {verificationResult.status !== 'unknown' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Marque</p>
                    <p className="font-medium">{verificationResult.brand || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Modèle</p>
                    <p className="font-medium">{verificationResult.model || 'N/A'}</p>
                  </div>
                </div>

                {verificationResult.color && (
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 rounded-full border border-gray-300" style={{ backgroundColor: verificationResult.color }}></div>
                    <div>
                      <p className="text-sm text-gray-500">Couleur</p>
                      <p className="font-medium">{verificationResult.color}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {verificationResult.owner_name && (
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Propriétaire</p>
                      <p className="font-medium">{verificationResult.owner_name}</p>
                    </div>
                  </div>
                )}

                {verificationResult.registration_date && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date d'enregistrement</p>
                      <p className="font-medium">
                        {new Date(verificationResult.registration_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}

                {verificationResult.city && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Ville</p>
                      <p className="font-medium">{verificationResult.city}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* IMEI copiable */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">IMEI vérifié</p>
                <p className="font-mono text-lg">{verificationResult.imei}</p>
              </div>
              <button
                onClick={copyIMEI}
                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copier</span>
              </button>
            </div>
          </div>

          {/* Actions selon le statut */}
          <div className="flex flex-col sm:flex-row gap-3">
            {verificationResult.status === 'unknown' && (
              <button
                onClick={handleRegisterNew}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Enregistrer ce téléphone
              </button>
            )}

            {(verificationResult.status === 'stolen' || verificationResult.status === 'lost') && (
              <div className="flex-1 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <p className="text-red-800 font-medium">
                    ⚠️ Ce téléphone a été signalé comme {verificationResult.status === 'stolen' ? 'volé' : 'perdu'} !
                  </p>
                </div>
                <p className="text-red-700 text-sm mt-2">
                  Une alerte a été automatiquement envoyée au support et à l'administration.
                </p>
              </div>
            )}

            {verificationResult.status === 'normal' && (
              <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-green-800 font-medium">
                    ✅ Ce téléphone est valide et peut être acheté en toute sécurité.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Instructions d'utilisation</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Vérifiez toujours l'IMEI avant d'acheter un téléphone d'occasion</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Si l'IMEI est inconnu, proposez l'enregistrement au vendeur</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>En cas d'IMEI volé/perdu, contactez immédiatement les autorités</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Les alertes sont automatiquement envoyées au support</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VerifyIMEIPage;
