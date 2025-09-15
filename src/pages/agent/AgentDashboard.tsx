import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { agentService } from '@/services/api';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Wallet,
  FileText,
  UserPlus,
  Search,
  AlertCircle,
  Copy,
  ExternalLink,
  TrendingUp,
  Bell,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AgentDashboard = () => {
  // Récupération des statistiques
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: agentService.getStats,
  });

  // Récupération des alertes
  const { data: alerts } = useQuery({
    queryKey: ['agent-alerts'],
    queryFn: agentService.getAlerts,
  });

  // Récupération des statistiques de parrainage
  const { data: referralStats } = useQuery({
    queryKey: ['agent-referral-stats'],
    queryFn: agentService.getReferralStats,
  });

  const copyReferralLink = () => {
    if (stats?.referral_link) {
      navigator.clipboard.writeText(stats.referral_link);
      toast.success('Lien de parrainage copié dans le presse-papiers');
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      await agentService.markAlertAsRead(alertId);
      toast.success('Alerte marquée comme lue');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'alerte');
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Impossible de charger les statistiques</p>
        <button
          onClick={() => refetchStats()}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </button>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Enregistrer un téléphone',
      description: 'Nouvel enregistrement de téléphone',
      icon: FileText,
      link: '/agent/register-phone',
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Créer un compte client',
      description: 'Créer un compte pour un client',
      icon: UserPlus,
      link: '/agent/create-client',
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-500',
    },
    {
      title: 'Vérifier IMEI',
      description: 'Vérification avant achat',
      icon: Search,
      link: '/agent/verify-imei',
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Mes Enregistrements',
      description: 'Historique et gestion',
      icon: Clock,
      link: '/agent/registrations',
      color: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Mes Clients',
      description: 'Gérer le portefeuille clients',
      icon: Users,
      link: '/agent/clients',
      color: 'from-teal-500 to-teal-600',
      iconColor: 'text-teal-500',
    },
    {
      title: 'Comptabilité',
      description: 'Revenus et retraits',
      icon: DollarSign,
      link: '/agent/accounting',
      color: 'from-emerald-500 to-emerald-600',
      iconColor: 'text-emerald-500',
    },
  ];

  const unreadAlerts = alerts?.filter(alert => !alert.is_read) || [];

  return (
    <div className="space-y-6">
      {/* Header avec actualisation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Agent</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos enregistrements et suivez vos performances
          </p>
        </div>
        <button
          onClick={() => refetchStats()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </button>
        </div>

      {/* Alertes importantes */}
      {unreadAlerts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">
              {unreadAlerts.length} alerte(s) non lue(s)
            </h3>
          </div>
          <div className="mt-2 space-y-2">
            {unreadAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                <p className="text-sm text-yellow-700">{alert.message}</p>
                <button
                  onClick={() => markAlertAsRead(alert.id)}
                  className="text-xs text-yellow-600 hover:text-yellow-800"
                >
                  Marquer comme lu
                </button>
              </div>
            ))}
            </div>
          </div>
        )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enregistrements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_registrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Validés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.validated_registrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejetés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected_registrations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_registrations}</p>
                  </div>
                </div>
              </div>
        </div>

      {/* Revenus et parrainage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenus */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus & Commissions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Gains Totaux</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.total_revenue?.toLocaleString('fr-FR') || 0} FCFA
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Wallet className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Solde Disponible</p>
                  <p className="text-xl font-bold text-gray-900">
                    {stats.available_balance?.toLocaleString('fr-FR') || 0} FCFA
                  </p>
            </div>
              </div>
              </div>
              <Link
              to="/agent/accounting"
              className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
              Gérer mes revenus
              </Link>
            </div>
          </div>

        {/* Lien de parrainage */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lien de Parrainage</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Votre lien unique</p>
              <p className="font-mono text-sm break-all">{stats.referral_link}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyReferralLink}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>Copier le lien</span>
              </button>
              <button
                onClick={() => window.open(stats.referral_link, '_blank')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Partagez ce lien pour gagner des commissions sur les enregistrements de vos parrainés
            </p>
          </div>
        </div>
        </div>

        {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
              className="group p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                    </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </Link>
          ))}
          </div>
        </div>

      {/* Statistiques de parrainage */}
      {referralStats && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de Parrainage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{referralStats.total_referrals}</p>
              <p className="text-sm text-gray-600">Parrainages totaux</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{referralStats.active_referrals}</p>
              <p className="text-sm text-gray-600">Parrainages actifs</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-2">
                <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
              <p className="text-2xl font-bold text-gray-900">
                {referralStats.total_commission_earned?.toLocaleString('fr-FR') || 0} FCFA
              </p>
              <p className="text-sm text-gray-600">Commissions gagnées</p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AgentDashboard;
