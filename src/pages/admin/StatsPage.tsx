import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Download,
  Users,
  Smartphone,
  AlertTriangle,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  DollarSign,
} from 'lucide-react';
import { adminService } from '@/services/api';
import toast from 'react-hot-toast';

const AdminStatsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [showFilters, setShowFilters] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start_date: '',
    end_date: '',
  });

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['admin-stats', selectedPeriod],
    queryFn: () => adminService.getStats(),
  });

  // const { data: reportData } = useQuery({
  //   queryKey: ['admin-report-data', selectedPeriod, customDateRange],
  //   queryFn: () => adminService.generateReport(
  //     selectedPeriod === 'daily' ? 'daily' : selectedPeriod === 'weekly' ? 'weekly' : 'monthly',
  //     selectedPeriod === 'custom' ? customDateRange : undefined
  //   ),
  //   enabled: selectedPeriod !== 'custom' || (customDateRange.start_date && customDateRange.end_date),
  // });
  // const reportData = null;

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const reportId = 'temp-report';
      const blob = await adminService.exportReport(reportId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admin-stats-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Export ${format.toUpperCase()} téléchargé avec succès`);
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'daily':
        return 'Aujourd\'hui';
      case 'weekly':
        return 'Cette semaine';
      case 'monthly':
        return 'Ce mois';
      case 'custom':
        return 'Période personnalisée';
      default:
        return period;
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-500 mb-4">Impossible de charger les statistiques</p>
        <button
          onClick={() => refetchStats()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques & Rapports</h1>
          <p className="mt-2 text-gray-600">
            Vue d'ensemble des performances et activités de la plateforme
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Period Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Période d'analyse</h2>
        <div className="flex flex-wrap gap-2">
          {['daily', 'weekly', 'monthly', 'custom'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as any)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getPeriodLabel(period)}
            </button>
          ))}
        </div>

        {selectedPeriod === 'custom' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={customDateRange.start_date}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={customDateRange.end_date}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_users || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Smartphone className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Téléphones enregistrés</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_phones || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Signalements</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_phones || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_revenue || 0} FCFA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs par rôle</h3>
          <div className="space-y-3">
            {(stats as any)?.users_by_role?.map((role: any) => (
              <div key={role.role} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    role.role === 'user' ? 'bg-green-500' :
                    role.role === 'agent' ? 'bg-blue-500' :
                    role.role === 'police' ? 'bg-purple-500' :
                    role.role === 'admin' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {role.role}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(role.count / Math.max(...((stats as any)?.users_by_role?.map((r: any) => r.count) || [1]))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{role.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reports by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Signalements par type</h3>
          <div className="space-y-3">
            {(stats as any)?.reports_by_type?.map((type: any) => (
              <div key={type.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    type.type === 'theft' ? 'bg-red-500' :
                    type.type === 'loss' ? 'bg-yellow-500' :
                    type.type === 'found' ? 'bg-green-500' :
                    type.type === 'suspicious' ? 'bg-orange-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {type.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(type.count / Math.max(...((stats as any)?.reports_by_type?.map((t: any) => t.count) || [1]))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{type.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des revenus</h3>
        <div className="space-y-2">
          {(stats as any)?.revenue_by_month?.slice(0, 6).map((month: any) => (
            <div key={month.month} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{month.month}</span>
              <div className="flex items-center">
                <div className="w-40 bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${(month.amount / Math.max(...((stats as any)?.revenue_by_month?.map((m: any) => m.amount) || [1]))) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{month.amount} FCFA</span>
              </div>
            </div>
          ))}
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
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.user_name} • {new Date(activity.timestamp).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes système</h3>
        <div className="space-y-3">
                      {stats?.alerts?.slice(0, 5).map((alert: any) => (
            <div key={alert.id} className={`p-3 rounded-lg ${
              alert.type === 'fraud_suspicion' ? 'bg-red-50 border border-red-200' :
              alert.type === 'high_reports' ? 'bg-yellow-50 border border-yellow-200' :
              alert.type === 'system_anomaly' ? 'bg-blue-50 border border-blue-200' :
              'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center">
                <AlertTriangle className={`h-4 w-4 mr-2 ${
                  alert.type === 'fraud_suspicion' ? 'text-red-500' :
                  alert.type === 'high_reports' ? 'text-yellow-500' :
                  alert.type === 'system_anomaly' ? 'text-blue-500' :
                  'text-gray-500'
                }`} />
                <span className="text-sm font-medium text-gray-900">{alert.title}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(alert.timestamp).toLocaleString('fr-FR')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage;
