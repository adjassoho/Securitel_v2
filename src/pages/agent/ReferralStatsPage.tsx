import { useQuery } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import {
  Users,
  TrendingUp,
  DollarSign,
  Copy,
  ExternalLink,
  RefreshCw,
  Share2,
  QrCode,
  Calendar,
  BarChart3,
  Target,
  Award,
  Link as LinkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const ReferralStatsPage = () => {
  // Récupération des statistiques de parrainage
  const { data: referralStats, isLoading, refetch } = useQuery({
    queryKey: ['agent-referral-stats'],
    queryFn: agentService.getReferralStats,
  });

  // Récupération du lien de parrainage
  const { data: referralLink } = useQuery({
    queryKey: ['agent-referral-link'],
    queryFn: agentService.getReferralLink,
  });

  const copyReferralLink = () => {
    if (referralLink?.link) {
      navigator.clipboard.writeText(referralLink.link);
      toast.success('Lien de parrainage copié dans le presse-papiers');
    }
  };

  const shareReferralLink = () => {
    if (referralLink?.link) {
      if (navigator.share) {
        navigator.share({
          title: 'Rejoignez SecuriTels',
          text: 'Enregistrez vos téléphones et protégez-les contre le vol avec SecuriTels',
          url: referralLink.link,
        });
      } else {
        copyReferralLink();
      }
    }
  };

  const generateQRCode = () => {
    // Placeholder pour la génération de QR code
    toast('Génération de QR code en cours de développement');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques de Parrainage</h1>
          <p className="mt-2 text-gray-600">
            Suivez vos performances de parrainage et vos commissions
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parrainages Totaux</p>
              <p className="text-2xl font-bold text-gray-900">
                {referralStats?.total_referrals || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parrainages Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {referralStats?.active_referrals || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commissions Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {referralStats?.total_commission_earned?.toLocaleString('fr-FR') || 0} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Commission Mensuelle</p>
              <p className="text-2xl font-bold text-gray-900">
                {referralStats?.monthly_commission?.toLocaleString('fr-FR') || 0} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lien de parrainage */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Votre Lien de Parrainage</h3>
          <div className="flex space-x-2">
            <button
              onClick={generateQRCode}
              className="inline-flex items-center px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <QrCode className="h-4 w-4 mr-1" />
              QR Code
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <LinkIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Lien unique</span>
            </div>
            <p className="font-mono text-sm break-all text-gray-900">
              {referralLink?.link || 'Chargement...'}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={copyReferralLink}
              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copier le lien</span>
            </button>
            <button
              onClick={shareReferralLink}
              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </button>
            <button
              onClick={() => window.open(referralLink?.link, '_blank')}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>💡 Astuce :</strong> Partagez ce lien avec vos contacts. 
              Chaque personne qui s'inscrit via ce lien devient votre parrainé et 
              vous génère des commissions sur ses enregistrements !
            </p>
          </div>
        </div>
      </div>

      {/* Graphiques de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance mensuelle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Mensuelle</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ce mois</span>
              <span className="font-semibold text-gray-900">
                {referralStats?.monthly_commission?.toLocaleString('fr-FR') || 0} FCFA
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: '75%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              Objectif mensuel : 50 000 FCFA
            </p>
          </div>
        </div>

        {/* Taux de conversion */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Taux de Conversion</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Parrainages actifs</span>
              <span className="font-semibold text-gray-900">
                {referralStats?.active_referrals || 0} / {referralStats?.total_referrals || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ 
                  width: `${referralStats?.total_referrals ? 
                    (referralStats.active_referrals / referralStats.total_referrals) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">
              {referralStats?.total_referrals ? 
                Math.round((referralStats.active_referrals / referralStats.total_referrals) * 100) : 0}% de parrainages actifs
            </p>
          </div>
        </div>
      </div>

      {/* Conseils pour améliorer les parrainages */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Conseils pour Améliorer vos Parrainages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Target className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Ciblez vos contacts</p>
                <p className="text-sm text-gray-600">
                  Partagez avec des personnes qui possèdent des téléphones de valeur
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Expliquez les avantages</p>
                <p className="text-sm text-gray-600">
                  Montrez comment SecuriTels protège leurs appareils
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Suivez régulièrement</p>
                <p className="text-sm text-gray-600">
                  Vérifiez l'activité de vos parrainés et encouragez-les
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Award className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Offrez un service</p>
                <p className="text-sm text-gray-600">
                  Aidez vos parrainés à enregistrer leurs téléphones
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historique des parrainages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des Parrainages</h3>
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun parrainage encore</h4>
          <p className="text-gray-500 mb-4">
            Commencez à partager votre lien de parrainage pour voir vos parrainés ici
          </p>
          <button
            onClick={shareReferralLink}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Partager maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralStatsPage;
