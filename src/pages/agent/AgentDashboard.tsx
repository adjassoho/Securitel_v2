import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { agentService } from '@/services/api';
import type { AgentStats } from '@/types';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Wallet,
  Share2,
  FileText,
  UserPlus,
  Search,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AgentDashboard = () => {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await agentService.getStats();
      setStats(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    if (!stats?.referral_link) return;
    
    setCopying(true);
    try {
      await navigator.clipboard.writeText(stats.referral_link);
      toast.success('Lien de parrainage copié!');
    } catch (error) {
      toast.error('Erreur lors de la copie du lien');
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Impossible de charger les statistiques</p>
      </div>
    );
  }

  const quickActions = [
    {
      title: 'Enregistrer un téléphone',
      icon: FileText,
      link: '/agent/register-phone',
      color: 'bg-blue-500',
    },
    {
      title: 'Créer un compte client',
      icon: UserPlus,
      link: '/agent/create-client',
      color: 'bg-green-500',
    },
    {
      title: 'Vérifier IMEI',
      icon: Search,
      link: '/agent/verify-imei',
      color: 'bg-purple-500',
    },
    {
      title: 'Historique',
      icon: Clock,
      link: '/agent/registrations',
      color: 'bg-orange-500',
    },
  ];

  const statsCards = [
    {
      title: 'Total Enregistrements',
      value: stats.total_registrations,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Validés',
      value: stats.validated_registrations,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Rejetés',
      value: stats.rejected_registrations,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'En attente',
      value: stats.pending_registrations,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Agent</h1>
          <p className="mt-2 text-gray-600">Gérez vos enregistrements et suivez vos commissions</p>
        </div>

        {/* Alertes */}
        {stats.pending_registrations > 0 && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Vous avez {stats.pending_registrations} enregistrement(s) en attente de validation
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revenus */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenus</h2>
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total des gains</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_revenue.toLocaleString()} FCFA</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Solde disponible</p>
                <p className="text-2xl font-bold text-green-600">{stats.available_balance.toLocaleString()} FCFA</p>
              </div>
              <Link
                to="/agent/withdrawals"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Wallet className="h-4 w-4 mr-2" />
                Demander un retrait
              </Link>
            </div>
          </div>

          {/* Lien de parrainage */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Lien de parrainage</h2>
              <Share2 className="h-6 w-6 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Partagez ce lien pour que vos clients s'inscrivent et soient automatiquement rattachés à votre compte
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={stats.referral_link}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
              <button
                onClick={copyReferralLink}
                disabled={copying}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {copying ? 'Copie...' : 'Copier'}
              </button>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center">
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="ml-4 text-base font-medium text-gray-900">{action.title}</h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500">Vos dernières activités apparaîtront ici</p>
            <Link
              to="/agent/registrations"
              className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Voir tout l'historique
              <Clock className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;

