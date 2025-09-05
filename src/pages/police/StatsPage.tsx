import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Download,
  MapPin,
  User,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { policeService } from '@/services/api';
import toast from 'react-hot-toast';

const StatsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [showFilters, setShowFilters] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({
    start_date: '',
    end_date: '',
  });

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['police-stats', selectedPeriod],
    queryFn: () => policeService.getStats(selectedPeriod === 'custom' ? 'daily' : selectedPeriod),
  });

  // const { data: reportData } = useQuery({
  //   queryKey: ['police-report-data', selectedPeriod, customDateRange],
  //   queryFn: () => policeService.generateReport(
  //     selectedPeriod === 'daily' ? 'daily' : selectedPeriod === 'weekly' ? 'weekly' : selectedPeriod === 'monthly' ? 'monthly' : 'custom',
  //     selectedPeriod === 'custom' ? customDateRange : undefined
  //   ),
  //   enabled: selectedPeriod !== 'custom' || (customDateRange.start_date && customDateRange.end_date),
  // });
  const reportData = null;

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const reportId = 'temp-report'; // In real app, this would be generated
      const blob = await policeService.exportReport(reportId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `police-stats-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.${format}`;
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
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="mt-2 text-gray-600">
            Vue d'ensemble des activités et performances
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
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Téléphones volés</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_stolen_phones || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Téléphones retrouvés</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total_recovered_phones || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Smartphone className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Signalements actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.active_reports || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Recherches effectuées</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.search_logs_count || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
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
                    status.status === 'transmitted_police' ? 'bg-purple-500' :
                    status.status === 'in_investigation' ? 'bg-orange-500' :
                    status.status === 'resolved' ? 'bg-green-500' :
                    status.status === 'closed' ? 'bg-gray-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {status.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(status.count / Math.max(...(stats?.reports_by_status?.map(s => s.count) || [1]))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{status.count}</span>
                </div>
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
                      className="bg-green-600 h-2 rounded-full"
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
                  <BarChart3 className="h-4 w-4 text-blue-600" />
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

      {/* Performance Metrics */}
      {reportData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance par officier</h3>
            <div className="space-y-3">
              {(reportData as any).by_officer?.slice(0, 5).map((officer: any) => (
                <div key={officer.officer_name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{officer.officer_name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{officer.reports_handled} dossiers</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline des signalements</h3>
            <div className="space-y-2">
              {(reportData as any).timeline?.slice(0, 7).map((day: any) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(day.date).toLocaleDateString('fr-FR')}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Créés:</span>
                      <span className="text-sm font-medium text-blue-600">{day.reports_created}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">Résolus:</span>
                      <span className="text-sm font-medium text-green-600">{day.reports_resolved}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
