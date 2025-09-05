import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  RefreshCw,
  Bell,
  Eye,
  FileText,
  AlertCircle,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface IMEIAlert {
  id: string;
  imei: string;
  alert_type: 'stolen' | 'lost' | 'suspicious' | 'duplicate';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  phone_details?: {
    brand?: string;
    model?: string;
    color?: string;
    owner_name?: string;
    registration_date?: string;
  };
  created_at: string;
  is_read: boolean;
  is_resolved: boolean;
  resolved_at?: string;
  resolution_notes?: string;
}

const IMEIAlertsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    alert_type: '',
    severity: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Récupération des alertes IMEI
  const { data: alerts, isLoading, error, refetch } = useQuery({
    queryKey: ['agent-imei-alerts', filters],
    queryFn: () => agentService.getIMEIAlerts({
      search: filters.search || undefined,
      alert_type: filters.alert_type || undefined,
      severity: filters.severity || undefined,
      status: filters.status || undefined,
    }),
  });

  // Mutation pour marquer une alerte comme lue
  const markAsReadMutation = useMutation({
    mutationFn: (alertId: string) => agentService.markIMEIAlertAsRead(alertId),
    onSuccess: () => {
      toast.success('Alerte marquée comme lue');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour de l\'alerte');
    },
  });

  // Mutation pour résoudre une alerte
  const resolveAlertMutation = useMutation({
    mutationFn: ({ alertId, notes }: { alertId: string; notes: string }) => 
      agentService.resolveIMEIAlert(alertId, notes),
    onSuccess: () => {
      toast.success('Alerte résolue');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors de la résolution de l\'alerte');
    },
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      alert_type: '',
      severity: '',
      status: '',
    });
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'stolen':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'lost':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'suspicious':
        return <Eye className="h-5 w-5 text-orange-500" />;
      case 'duplicate':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'Critique';
      case 'high':
        return 'Élevée';
      case 'medium':
        return 'Moyenne';
      case 'low':
        return 'Faible';
      default:
        return 'Inconnue';
    }
  };

  const getAlertTypeText = (alertType: string) => {
    switch (alertType) {
      case 'stolen':
        return 'Téléphone Volé';
      case 'lost':
        return 'Téléphone Perdu';
      case 'suspicious':
        return 'Activité Suspecte';
      case 'duplicate':
        return 'IMEI Dupliqué';
      default:
        return 'Inconnu';
    }
  };

  const filteredAlerts = alerts?.filter((alert: IMEIAlert) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        alert.imei.toLowerCase().includes(searchTerm) ||
        alert.message.toLowerCase().includes(searchTerm) ||
        alert.phone_details?.brand?.toLowerCase().includes(searchTerm) ||
        alert.phone_details?.model?.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  }) || [];

  const unreadCount = filteredAlerts.filter((alert: IMEIAlert) => !alert.is_read).length;
  const criticalCount = filteredAlerts.filter((alert: IMEIAlert) => alert.severity === 'critical' && !alert.is_resolved).length;

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
        <p className="text-gray-500 mb-4">Impossible de charger les alertes IMEI</p>
        <button
          onClick={() => refetch()}
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
          <h1 className="text-3xl font-bold text-gray-900">Alertes IMEI</h1>
          <p className="mt-2 text-gray-600">
            Surveillez les alertes de sécurité et les IMEI suspects
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
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Alertes importantes */}
      {(unreadCount > 0 || criticalCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unreadCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="text-sm font-medium text-yellow-800">
                  {unreadCount} alerte(s) non lue(s)
                </h3>
              </div>
            </div>
          )}
          {criticalCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-800">
                  {criticalCount} alerte(s) critique(s)
                </h3>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filtres */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres de recherche</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="IMEI, marque, modèle..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'alerte
              </label>
              <select
                value={filters.alert_type}
                onChange={(e) => handleFilterChange('alert_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="stolen">Téléphone Volé</option>
                <option value="lost">Téléphone Perdu</option>
                <option value="suspicious">Activité Suspecte</option>
                <option value="duplicate">IMEI Dupliqué</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gravité
              </label>
              <select
                value={filters.severity}
                onChange={(e) => handleFilterChange('severity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les gravités</option>
                <option value="critical">Critique</option>
                <option value="high">Élevée</option>
                <option value="medium">Moyenne</option>
                <option value="low">Faible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="unread">Non lues</option>
                <option value="read">Lues</option>
                <option value="resolved">Résolues</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des alertes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Alertes IMEI ({filteredAlerts.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune alerte trouvée</h3>
              <p className="text-gray-500">Aucune alerte IMEI ne correspond à vos critères</p>
            </div>
          ) : (
            filteredAlerts.map((alert: IMEIAlert) => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.alert_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {getAlertTypeText(alert.alert_type)}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                          {getSeverityText(alert.severity)}
                        </span>
                        {!alert.is_read && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Non lue
                          </span>
                        )}
                        {alert.is_resolved && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Résolue
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <strong>IMEI:</strong> {alert.imei}
                        </p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        
                        {alert.phone_details && (
                          <div className="bg-gray-50 rounded-lg p-3 mt-3">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Détails du téléphone</h5>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              {alert.phone_details.brand && (
                                <p><strong>Marque:</strong> {alert.phone_details.brand}</p>
                              )}
                              {alert.phone_details.model && (
                                <p><strong>Modèle:</strong> {alert.phone_details.model}</p>
                              )}
                              {alert.phone_details.color && (
                                <p><strong>Couleur:</strong> {alert.phone_details.color}</p>
                              )}
                              {alert.phone_details.owner_name && (
                                <p><strong>Propriétaire:</strong> {alert.phone_details.owner_name}</p>
                              )}
                              {alert.phone_details.registration_date && (
                                <p><strong>Enregistré le:</strong> {new Date(alert.phone_details.registration_date).toLocaleDateString('fr-FR')}</p>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(alert.created_at).toLocaleDateString('fr-FR')} à {new Date(alert.created_at).toLocaleTimeString('fr-FR')}
                        </div>

                        {alert.resolution_notes && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                            <h5 className="text-sm font-medium text-green-900 mb-1">Notes de résolution</h5>
                            <p className="text-sm text-green-800">{alert.resolution_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!alert.is_read && (
                      <button
                        onClick={() => markAsReadMutation.mutate(alert.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Marquer comme lu"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {!alert.is_resolved && (
                      <button
                        onClick={() => {
                          const notes = prompt('Notes de résolution (optionnel):');
                          if (notes !== null) {
                            resolveAlertMutation.mutate({ alertId: alert.id, notes });
                          }
                        }}
                        className="p-2 text-green-400 hover:text-green-600 transition-colors"
                        title="Résoudre l'alerte"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IMEIAlertsPage;
