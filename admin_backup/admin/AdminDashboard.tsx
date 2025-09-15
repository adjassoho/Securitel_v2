import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Smartphone,
  AlertTriangle,
  UserCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { adminService } from '@/services/api';
import type { AdminAlert } from '@/types';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d' | '90d'>('24h');

  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-stats', selectedPeriod],
    queryFn: adminService.getStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: alertsData } = useQuery({
    queryKey: ['admin-alerts'],
    queryFn: adminService.getAlerts,
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  useEffect(() => {
    if (alertsData) {
      setAlerts(alertsData);
    }
  }, [alertsData]);

  const handleRefresh = () => {
    refetch();
    toast.success('Données actualisées');
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await adminService.markAlertAsResolved(alertId);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alerte résolue');
    } catch (error) {
      toast.error('Erreur lors de la résolution de l\'alerte');
    }
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
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
      title: 'Utilisateurs inscrits',
      value: stats?.total_users || 0,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      title: 'IMEI enregistrés',
      value: stats?.total_phones || 0,
      change: '+8%',
      changeType: 'positive' as const,
      icon: Smartphone,
      color: 'bg-green-500',
      link: '/admin/phones',
    },
    {
      title: 'Signalements actifs',
      value: stats?.active_reports || 0,
      change: '-3%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'bg-red-500',
      link: '/admin/reports',
    },
    {
      title: 'Techniciens actifs',
      value: stats?.active_technicians || 0,
      change: '+5%',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'bg-purple-500',
      link: '/admin/users?role=technician',
    },
    {
      title: 'Revenus générés',
      value: `$${(stats?.total_revenue || 0).toLocaleString()}`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-emerald-500',
      link: '/admin/finance',
    },
  ];

  const quickActions = [
    {
      title: 'Nouvel utilisateur',
      description: 'Créer un compte utilisateur',
      icon: Users,
      link: '/admin/users/create',
      color: 'bg-blue-600',
    },
    {
      title: 'Enregistrer téléphone',
      description: 'Enregistrement manuel',
      icon: Smartphone,
      link: '/admin/phones/register',
      color: 'bg-green-600',
    },
    {
      title: 'Valider agents',
      description: 'Candidatures en attente',
      icon: UserCheck,
      link: '/admin/agents/applications',
      color: 'bg-purple-600',
    },
    {
      title: 'Générer rapport',
      description: 'Rapport personnalisé',
      icon: BarChart3,
      link: '/admin/reports/custom',
      color: 'bg-orange-600',
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'fraud_suspicion':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'high_reports':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'system_anomaly':
        return <Activity className="h-5 w-5 text-yellow-500" />;
      case 'security_breach':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'high':
        return 'border-orange-200 bg-orange-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
          <p className="mt-2 text-gray-600">
            Vue d'ensemble de la plateforme SecuriTel
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
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

        {/* Alerts */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Alertes récentes</h3>
              <span className="text-sm text-gray-500">{alerts.length} alertes</span>
            </div>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-500">Aucune alerte active</p>
                </div>
              ) : (
                alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        {getAlertIcon(alert.type)}
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{alert.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      {alert.action_required && !alert.resolved && (
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Résoudre
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {alerts.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  to="/admin/alerts"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Voir toutes les alertes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by City */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par ville</h3>
          <div className="space-y-3">
            {stats?.users_by_city?.slice(0, 5).map((city) => (
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
                        width: `${(city.count / Math.max(...(stats?.users_by_city?.map(c => c.count) || [1]))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{city.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                    status.status === 'transmitted_police' ? 'bg-purple-500' :
                    status.status === 'resolved' ? 'bg-green-500' : 'bg-gray-500'
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
                  {new Date(activity.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
