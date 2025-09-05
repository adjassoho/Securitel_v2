import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { technicianService } from '@/services/api';
import {
  Smartphone,
  Search,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  RefreshCw,
  QrCode,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TechnicianDashboard = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ['technician-dashboard'],
    queryFn: technicianService.getDashboard,
  });

  const { data: codeTGSM } = useQuery({
    queryKey: ['technician-code-tgsm'],
    queryFn: technicianService.getCodeTGSM,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refetch data
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Erreur lors du chargement des données</p>
        </div>
      </div>
    );
  }

  const stats = dashboard?.stats || {
    total_verifications: 0,
    total_reports: 0,
    total_earnings: 0,
    current_balance: 0,
    registered_people: 0,
    success_rate: 0,
    average_rating: 0,
  };

  const recentVerifications = dashboard?.recent_verifications || [];
  const recentReports = dashboard?.recent_reports || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Technicien</h1>
          <p className="text-gray-600">Bienvenue dans votre espace technicien GSM</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Code T-GSM */}
      {codeTGSM && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Mon code T-GSM</h2>
              <p className="text-blue-100 mb-4">Votre identifiant unique de technicien</p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold">{codeTGSM.code_tgsm}</span>
                </div>
                <Link
                  to="/technician/code-tgsm"
                  className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Voir QR Code
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <QrCode className="h-24 w-24 text-white/30" />
            </div>
          </div>
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vérifications</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_verifications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Signalements</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total_reports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Gains totaux</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total_earnings.toLocaleString()} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Personnes enregistrées</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.registered_people}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Solde actuel</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.current_balance.toLocaleString()} FCFA
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Taux de réussite</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.success_rate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Note moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.average_rating}/5</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/technician/verify-imei"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Vérifier IMEI</p>
              <p className="text-sm text-gray-500">Vérifier un téléphone</p>
            </div>
          </Link>

          <Link
            to="/technician/report-theft"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Signaler vol</p>
              <p className="text-sm text-gray-500">Signaler un vol</p>
            </div>
          </Link>

          <Link
            to="/technician/accounting"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Comptabilité</p>
              <p className="text-sm text-gray-500">Gérer mes gains</p>
            </div>
          </Link>

          <Link
            to="/technician/history"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Activity className="h-6 w-6 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Historique</p>
              <p className="text-sm text-gray-500">Voir l'historique</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vérifications récentes */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Vérifications récentes</h2>
            <Link
              to="/technician/history"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {recentVerifications.length > 0 ? (
              recentVerifications.slice(0, 5).map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        IMEI: {verification.imei}
                      </p>
                      <p className="text-xs text-gray-500">
                        {verification.verification_type} • {new Date(verification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {verification.status === 'valid' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {verification.status === 'stolen' && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                    {verification.status === 'unknown' && (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune vérification récente</p>
            )}
          </div>
        </div>

        {/* Signalements récents */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Signalements récents</h2>
            <Link
              to="/technician/history"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {recentReports.length > 0 ? (
              recentReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {report.report_type} • {report.phone.imei}
                      </p>
                      <p className="text-xs text-gray-500">
                        {report.location} • {new Date(report.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {report.status === 'pending' && (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    {report.status === 'validated' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {report.status === 'rejected' && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucun signalement récent</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
