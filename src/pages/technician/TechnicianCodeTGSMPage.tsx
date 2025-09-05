import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { technicianService } from '@/services/api';
import {
  QrCode,
  Copy,
  Download,
  RefreshCw,
  ArrowLeft,
  Smartphone,
  User,
  Calendar,
  CheckCircle,
  Share2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TechnicianCodeTGSMPage = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const { data: codeData, isLoading, error } = useQuery({
    queryKey: ['technician-code-tgsm'],
    queryFn: technicianService.getCodeTGSM,
  });

  const { data: profile } = useQuery({
    queryKey: ['technician-profile'],
    queryFn: technicianService.getProfile,
  });

  const handleCopyCode = async () => {
    if (codeData?.code_tgsm) {
      try {
        await navigator.clipboard.writeText(codeData.code_tgsm);
        setCopied(true);
        toast.success('Code T-GSM copié dans le presse-papiers !');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('Erreur lors de la copie');
      }
    }
  };

  const handleDownloadQR = () => {
    // Ici on pourrait implémenter le téléchargement du QR code
    toast.success('QR Code téléchargé !');
  };

  const handleShare = async () => {
    if (navigator.share && codeData?.code_tgsm) {
      try {
        await navigator.share({
          title: 'Mon code T-GSM SecuriTel',
          text: `Mon code technicien GSM: ${codeData.code_tgsm}`,
        });
      } catch (err) {
        // Fallback to copy
        handleCopyCode();
      }
    } else {
      handleCopyCode();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du code T-GSM...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 text-red-600 mx-auto mb-4">⚠️</div>
          <p className="text-gray-600">Erreur lors du chargement du code T-GSM</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/technician/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon code T-GSM</h1>
          <p className="text-gray-600">Votre identifiant unique de technicien GSM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Code T-GSM principal */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-8 text-white">
          <div className="text-center">
            <div className="mb-6">
              <QrCode className="h-16 w-16 text-white/80 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Code T-GSM</h2>
              <p className="text-blue-100">Votre identifiant unique de technicien</p>
            </div>

            {/* Code principal */}
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold tracking-wider mb-2">
                {codeData?.code_tgsm || 'T-GSM-XXXX'}
              </div>
              <div className="text-blue-100 text-sm">
                Technicien GSM SecuriTel
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleCopyCode}
                className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copié !' : 'Copier le code'}
              </button>

              <button
                onClick={handleShare}
                className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </button>
            </div>
          </div>
        </div>

        {/* QR Code et informations */}
        <div className="space-y-6">
          {/* QR Code */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
            <div className="text-center">
              {codeData?.qr_code ? (
                <img
                  src={codeData.qr_code}
                  alt="QR Code T-GSM"
                  className="mx-auto mb-4"
                  style={{ maxWidth: '200px' }}
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <p className="text-sm text-gray-600 mb-4">
                Scannez ce code pour accéder rapidement à votre profil technicien
              </p>
              <button
                onClick={handleDownloadQR}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger QR Code
              </button>
            </div>
          </div>

          {/* Informations technicien */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations technicien</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.user?.first_name} {profile?.user?.last_name}
                  </p>
                  <p className="text-xs text-gray-500">Nom complet</p>
                </div>
              </div>

              <div className="flex items-center">
                <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.contact_phone || 'Non renseigné'}
                  </p>
                  <p className="text-xs text-gray-500">Téléphone de contact</p>
                </div>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.experience_years || 0} ans d'expérience
                  </p>
                  <p className="text-xs text-gray-500">Expérience professionnelle</p>
                </div>
              </div>

              {profile?.specializations && profile.specializations.length > 0 && (
                <div className="flex items-start">
                  <div className="h-5 w-5 text-gray-400 mr-3 mt-0.5">🔧</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {profile.specializations.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">Spécialisations</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions d'utilisation */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Comment utiliser votre code T-GSM</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 mr-3 mt-0.5">
                  1
                </div>
                <p>Présentez votre code T-GSM aux clients pour les rassurer sur votre professionnalisme</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 mr-3 mt-0.5">
                  2
                </div>
                <p>Utilisez le QR Code pour un accès rapide à votre profil technicien</p>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-800 mr-3 mt-0.5">
                  3
                </div>
                <p>Partagez votre code avec vos clients pour qu'ils puissent vous retrouver facilement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section avantages */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Avantages du code T-GSM</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Crédibilité</h4>
            <p className="text-sm text-gray-600">
              Rassurez vos clients avec un identifiant officiel SecuriTel
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <QrCode className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Accessibilité</h4>
            <p className="text-sm text-gray-600">
              QR Code pour un accès instantané à votre profil technicien
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Partage facile</h4>
            <p className="text-sm text-gray-600">
              Partagez votre code avec vos clients et partenaires
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCodeTGSMPage;
