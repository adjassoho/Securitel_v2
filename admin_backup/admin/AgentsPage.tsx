import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Users,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  MapPin,
  Phone,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Shield,
  FileText,
  Star,
  TrendingUp,
} from 'lucide-react';
import { adminService } from '@/services/api';
import type { AdminAgent } from '@/types';
import toast from 'react-hot-toast';

const AgentsPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    date_from: '',
    date_to: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedAgent, setSelectedAgent] = useState<AdminAgent | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-agents', filters, page, limit],
    queryFn: () => adminService.getAgents({
      ...filters,
      page,
      limit,
    }),
  });

  const approveAgentMutation = useMutation({
    mutationFn: (agentId: string) => adminService.approveAgent(agentId),
    onSuccess: () => {
      toast.success('Agent approuvé avec succès');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors de l\'approbation');
    },
  });

  const rejectAgentMutation = useMutation({
    mutationFn: (agentId: string) => adminService.rejectAgent(agentId, 'Rejeté par admin'),
    onSuccess: () => {
      toast.success('Agent rejeté');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors du rejet');
    },
  });

  const suspendAgentMutation = useMutation({
    mutationFn: (agentId: string) => adminService.suspendAgent(agentId, 'Suspendu par admin'),
    onSuccess: () => {
      toast.success('Agent suspendu avec succès');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors de la suspension');
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
      search: '',
      date_from: '',
      date_to: '',
    });
    setPage(1);
  };

  const handleApproveAgent = (agentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir approuver cet agent ?')) {
      approveAgentMutation.mutate(agentId);
    }
  };

  const handleRejectAgent = (agentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir rejeter cet agent ?')) {
      rejectAgentMutation.mutate(agentId);
    }
  };

  const handleSuspendAgent = (agentId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir suspendre cet agent ?')) {
      suspendAgentMutation.mutate(agentId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'suspended':
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
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
        <p className="text-gray-500 mb-4">Impossible de charger les agents</p>
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

  const agents = data?.agents || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des agents</h1>
          <p className="mt-2 text-gray-600">
            Gérer les agents enregistreurs et leurs candidatures
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
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
                <option value="suspended">Suspendu</option>
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
                placeholder="Nom, email, téléphone..."
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
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total agents</p>
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
                {agents.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Approuvés</p>
              <p className="text-2xl font-bold text-gray-900">
                {agents.filter(a => a.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Performance</p>
              <p className="text-2xl font-bold text-gray-900">
                {agents.filter(a => a.status === 'approved').length > 0 
                  ? Math.round((agents.filter(a => a.status === 'approved').length / total) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Agents ({total})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {agents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun agent trouvé</h3>
              <p className="text-gray-500">Aucun agent ne correspond aux critères sélectionnés</p>
            </div>
          ) : (
            agents.map((agent) => (
              <div key={agent.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-medium">
                        {agent.first_name[0]}{agent.last_name[0]}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {agent.first_name} {agent.last_name}
                        </h4>
                        <span className="text-sm text-gray-500 font-mono">
                          ID: {agent.agent_id}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                          {getStatusIcon(agent.status)}
                          <span className="ml-1">{agent.status}</span>
                        </span>
                        {agent.status === 'approved' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Vérifié
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Phone className="h-4 w-4 mr-2" />
                            {agent.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-2" />
                            {agent.address}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            Candidature: {new Date(agent.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Spécialité:</span> GSM
                          </div>
                          <div className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Expérience:</span> 2 ans
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Performance:</span> {agent.performance_score || 'N/A'}/10
                          </div>
                        </div>
                      </div>

                      {agent.documents && agent.documents.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Documents fournis</h5>
                          <div className="flex flex-wrap gap-2">
                            {agent.documents.map((doc, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FileText className="h-3 w-3 mr-1" />
                                {doc.type}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {agent.status === 'rejected' && (
                        <div className="bg-yellow-50 rounded-lg p-3 mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-1">Notes</h5>
                          <p className="text-sm text-gray-600">Candidature rejetée</p>
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {agent.total_registrations || 0} enregistrements
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          0 FCFA gagnés
                        </div>
                        {agent.last_activity && (
                          <div className="flex items-center">
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Dernière activité: {new Date(agent.last_activity).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedAgent(agent)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    {agent.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveAgent(agent.id)}
                          className="p-2 text-green-400 hover:text-green-600 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRejectAgent(agent.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    {agent.status === 'approved' && (
                      <button
                        onClick={() => handleSuspendAgent(agent.id)}
                        className="p-2 text-yellow-400 hover:text-yellow-600 transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    )}
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

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedAgent(null)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Détails de l'agent
                    </h3>
                    <div className="mt-4 space-y-2">
                      <p><strong>Nom:</strong> {selectedAgent.first_name} {selectedAgent.last_name}</p>
                      <p><strong>Email:</strong> {selectedAgent.email}</p>
                      <p><strong>Téléphone:</strong> {selectedAgent.phone}</p>
                      <p><strong>Adresse:</strong> {selectedAgent.address}</p>
                      <p><strong>Spécialité:</strong> GSM</p>
                      <p><strong>Expérience:</strong> 2 ans</p>
                      <p><strong>Statut:</strong> {selectedAgent.status}</p>
                      <p><strong>Performance:</strong> {selectedAgent.performance_score || 'N/A'}/10</p>
                      <p><strong>Enregistrements:</strong> {selectedAgent.total_registrations || 0}</p>
                      <p><strong>Commission gagnée:</strong> 0 FCFA</p>
                      <p><strong>Candidature:</strong> {new Date(selectedAgent.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedAgent(null)}
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

export default AgentsPage;
