import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  MapPin,
  FileText,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { policeService } from '@/services/api';
import toast from 'react-hot-toast';

const PoliceDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [quickSearch, setQuickSearch] = useState('');

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['police-stats', selectedPeriod],
    queryFn: () => policeService.getStats(selectedPeriod),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentSearches } = useQuery({
    queryKey: ['police-recent-searches'],
    queryFn: () => policeService.getSearchLogs({ limit: 5 }),
  });


  const handleQuickSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;

    try {
      const result = await policeService.quickVerify(quickSearch);
      if (result.found) {
        toast.success('Téléphone trouvé dans la base de données');
      } else {
        toast('Téléphone non enregistré', { icon: 'ℹ️' });
      }
    } catch (error) {
      toast.error('Erreur lors de la recherche');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Données actualisées');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-500 mb-4">Impossible de charger les données du tableau de bord</p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </button>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Téléphones volés signalés',
      value: stats?.total_stolen_phones || 0,
      change: '+5%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'bg-red-500',
      link: '/police/reports?type=theft',
    },
    {
      title: 'Téléphones retrouvés',
      value: stats?.total_recovered_phones || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/police/reports?type=found',
    },
    {
      title: 'Signalements actifs',
      value: stats?.active_reports || 0,
      change: '-3%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'bg-blue-500',
      link: '/police/reports',
    },
    {
      title: 'Signalements résolus',
      value: stats?.resolved_reports || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: Shield,
      color: 'bg-purple-500',
      link: '/police/reports?status=resolved',
    },
  ];

  const quickActions = [
    {
      title: 'Vérification rapide',
      description: 'Vérifier un IMEI instantanément',
      icon: Search,
      link: '/police/search/quick',
      color: 'bg-blue-600',
    },
    {
      title: 'Recherche avancée',
      description: 'Recherche détaillée par critères',
      icon: Activity,
      link: '/police/search/advanced',
      color: 'bg-green-600',
    },
    {
      title: 'Nouveau dossier',
      description: 'Créer un nouveau dossier d\'enquête',
      icon: FileText,
      link: '/police/cases/create',
      color: 'bg-purple-600',
    },
    {
      title: 'Rapports',
      description: 'Générer des rapports',
      icon: BarChart3,
      link: '/police/stats/reports',
      color: 'bg-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Police</h1>
          <p className="mt-2 text-gray-600">
            Interface sécurisée pour les enquêtes et vérifications
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="daily">Aujourd'hui</option>
            <option value="weekly">Cette semaine</option>
            <option value="monthly">Ce mois</option>
          </select>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Quick Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recherche rapide</h3>
        <form onSubmit={handleQuickSearch} className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Entrez un IMEI, numéro de série ou numéro de téléphone..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="h-5 w-5 mr-2" />
            Vérifier
          </button>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                <div className="mt-2 flex items-center">
                  {card.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${action.color} mr-3`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Searches */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recherches récentes</h3>
              <Link
                to="/police/search/history"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Voir tout
              </Link>
            </div>
            <div className="space-y-3">
              {recentSearches?.logs?.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune recherche récente</p>
                </div>
              ) : (
                recentSearches?.logs?.slice(0, 5).map((search) => (
                  <div key={search.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Search className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {search.search_type.toUpperCase()}: {search.search_value}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(search.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {search.result_found ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signalements par statut</h3>
          <div className="space-y-3">
            {stats?.reports_by_status?.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    status.status === 'pending' ? 'bg-yellow-500' :
                    status.status === 'validated' ? 'bg-blue-500' :
                    status.status === 'in_investigation' ? 'bg-purple-500' :
                    status.status === 'resolved' ? 'bg-green-500' :
                    status.status === 'closed' ? 'bg-gray-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {status.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{status.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports by City */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signalements par ville</h3>
          <div className="space-y-3">
            {stats?.reports_by_city?.slice(0, 5).map((city) => (
              <div key={city.city} className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">{city.city}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(city.count / Math.max(...(stats?.reports_by_city?.map(c => c.count) || [1]))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{city.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h3>
        <div className="space-y-4">
          {stats?.recent_activities?.slice(0, 10).map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.officer_name} • {new Date(activity.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
