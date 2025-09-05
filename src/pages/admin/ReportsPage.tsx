import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  AlertTriangle,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  MapPin,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Shield,
  FileText,
} from 'lucide-react';
import { adminService } from '@/services/api';
import type { AdminReport } from '@/types';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    search: '',
    date_from: '',
    date_to: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-reports', filters, page, limit],
    queryFn: () => adminService.getReports({
      ...filters,
      page,
      limit,
    }),
  });

  // const updateReportStatusMutation = useMutation({
  //   mutationFn: ({ reportId, status, notes }: { reportId: string; status: string; notes?: string }) => 
  //     adminService.updateReportStatus(reportId, status, notes),
  //   onSuccess: () => {
  //     toast.success('Statut du signalement mis à jour');
  //     refetch();
  //   },
  //   onError: () => {
  //     toast.error('Erreur lors de la mise à jour');
  //   },
  // });

  const assignReportMutation = useMutation({
    mutationFn: ({ reportId, agentId }: { reportId: string; agentId: string }) => 
      adminService.assignReport(reportId, agentId),
    onSuccess: () => {
      toast.success('Signalement assigné avec succès');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors de l\'assignation');
    },
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      type: '',
      priority: '',
      search: '',
      date_from: '',
      date_to: '',
    });
    setPage(1);
  };

  // const handleUpdateStatus = (reportId: string, status: string) => {
  //   const notes = prompt('Notes (optionnelles):');
  //   updateReportStatusMutation.mutate({ reportId, status, notes: notes || undefined });
  // };

  const handleAssignReport = (reportId: string) => {
    const agentId = prompt('ID de l\'agent à assigner:');
    if (agentId) {
      assignReportMutation.mutate({ reportId, agentId });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'validated':
        return 'bg-blue-100 text-blue-800';
      case 'transmitted_police':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'theft':
        return 'bg-red-100 text-red-800';
      case 'loss':
        return 'bg-yellow-100 text-yellow-800';
      case 'found':
        return 'bg-green-100 text-green-800';
      case 'suspicious':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'theft':
        return <AlertTriangle className="h-4 w-4" />;
      case 'loss':
        return <Clock className="h-4 w-4" />;
      case 'found':
        return <CheckCircle className="h-4 w-4" />;
      case 'suspicious':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
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
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-500 mb-4">Impossible de charger les signalements</p>
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

  const reports = data?.reports || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des signalements</h1>
          <p className="mt-2 text-gray-600">
            Gérer tous les signalements de la plateforme
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
          <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres de recherche</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <option value="pending">En attente</option>
                <option value="validated">Validé</option>
                <option value="transmitted_police">Transmis Police</option>
                <option value="resolved">Résolu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="theft">Vol</option>
                <option value="loss">Perte</option>
                <option value="found">Retrouvé</option>
                <option value="suspicious">Suspect</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priorité
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Toutes les priorités</option>
                <option value="urgent">Urgent</option>
                <option value="high">Élevée</option>
                <option value="medium">Moyenne</option>
                <option value="low">Faible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="IMEI, nom, téléphone..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total signalements</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Résolus</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Transmis Police</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'transmitted_police').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Signalements ({total})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun signalement trouvé</h3>
              <p className="text-gray-500">Aucun signalement ne correspond aux critères sélectionnés</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        {getTypeIcon(report.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {report.type === 'theft' ? 'Vol' : 
                           report.type === 'loss' ? 'Perte' : 
                           report.type === 'found' ? 'Retrouvé' : 
                           'Suspect'} - {report.phone.brand} {report.phone.model}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Appareil</h5>
                          <p className="text-sm text-gray-600">
                            {report.phone.brand} {report.phone.model}
                          </p>
                          <p className="text-sm text-gray-600 font-mono">
                            IMEI: {report.phone.imei1}
                          </p>
                          {report.phone.serial_number && (
                            <p className="text-sm text-gray-600 font-mono">
                              S/N: {report.phone.serial_number}
                            </p>
                          )}
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Propriétaire</h5>
                          <p className="text-sm text-gray-600">{report.phone.owner.first_name} {report.phone.owner.last_name}</p>
                          <p className="text-sm text-gray-600">{report.phone.owner.phone}</p>
                          <p className="text-sm text-gray-600">{report.phone.owner.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(report.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {report.phone.owner.city || 'Non spécifié'}
                        </div>
                        {report.assigned_agent && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {report.assigned_agent.first_name} {report.assigned_agent.last_name}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-3">Signalement de {report.type}</p>

                      {report.police_reference && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Référence Police:</span> {report.police_reference}
                        </div>
                      )}

                      {report.resolution_notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Notes de résolution</h5>
                          <p className="text-sm text-gray-600">{report.resolution_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAssignReport(report.id)}
                      className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <User className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {page} sur {totalPages} ({total} résultats)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedReport(null)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Détails du signalement
                    </h3>
                    <div className="mt-4 space-y-2">
                      <p><strong>Type:</strong> {selectedReport.type}</p>
                      <p><strong>Statut:</strong> {selectedReport.status}</p>
                      <p><strong>Priorité:</strong> {selectedReport.priority}</p>
                      <p><strong>Appareil:</strong> {selectedReport.phone.brand} {selectedReport.phone.model}</p>
                      <p><strong>IMEI:</strong> {selectedReport.phone.imei1}</p>
                      <p><strong>Propriétaire:</strong> {selectedReport.phone.owner.first_name} {selectedReport.phone.owner.last_name}</p>
                      <p><strong>Email:</strong> {selectedReport.phone.owner.email}</p>
                      <p><strong>Téléphone:</strong> {selectedReport.phone.owner.phone}</p>
                      <p><strong>Créé le:</strong> {new Date(selectedReport.created_at).toLocaleDateString('fr-FR')}</p>
                      {selectedReport.police_reference && (
                        <p><strong>Référence Police:</strong> {selectedReport.police_reference}</p>
                      )}
                      {selectedReport.resolution_notes && (
                        <p><strong>Notes:</strong> {selectedReport.resolution_notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
