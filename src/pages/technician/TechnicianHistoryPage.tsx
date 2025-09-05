import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { technicianService } from '@/services/api';
import {
  History,
  Search,
  Filter,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Eye,
  Calendar,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TechnicianHistoryPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: '',
    from: '',
    to: '',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const { data: historyData, isLoading, error, refetch } = useQuery({
    queryKey: ['technician-history', filters, currentPage],
    queryFn: () => technicianService.getHistory({
      type: (filters.type as 'verification' | 'report') || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      page: currentPage,
      limit: 10,
    }),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      from: '',
      to: '',
      search: '',
    });
    setCurrentPage(1);
  };

  const getItemIcon = (item: any) => {
    if (item.verification_type) {
      return <Search className="h-5 w-5 text-blue-500" />;
    } else if (item.report_type) {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getItemType = (item: any) => {
    if (item.verification_type) {
      return 'Vérification';
    } else if (item.report_type) {
      return 'Signalement';
    }
    return 'Inconnu';
  };

  const getItemStatus = (item: any) => {
    if (item.status) {
      switch (item.status) {
        case 'valid':
          return { text: 'Valide', color: 'text-green-600', bg: 'bg-green-100' };
        case 'stolen':
          return { text: 'Volé', color: 'text-red-600', bg: 'bg-red-100' };
        case 'lost':
          return { text: 'Perdu', color: 'text-orange-600', bg: 'bg-orange-100' };
        case 'unknown':
          return { text: 'Inconnu', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        case 'pending':
          return { text: 'En attente', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        case 'validated':
          return { text: 'Validé', color: 'text-green-600', bg: 'bg-green-100' };
        case 'rejected':
          return { text: 'Rejeté', color: 'text-red-600', bg: 'bg-red-100' };
        default:
          return { text: item.status, color: 'text-gray-600', bg: 'bg-gray-100' };
      }
    }
    return { text: 'N/A', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const getItemDescription = (item: any) => {
    if (item.verification_type) {
      return `Vérification ${item.verification_type} - IMEI: ${item.imei}`;
    } else if (item.report_type) {
      return `Signalement ${item.report_type} - ${item.phone?.imei || 'N/A'}`;
    }
    return 'Description non disponible';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 text-red-600 mx-auto mb-4">⚠️</div>
          <p className="text-gray-600">Erreur lors du chargement de l'historique</p>
        </div>
      </div>
    );
  }

  const history = historyData?.history || [];
  const total = historyData?.total || 0;
  const totalPages = historyData?.total_pages || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/technician/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
            <p className="text-gray-600">Vérifications et signalements</p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Masquer' : 'Afficher'} les filtres
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tous les types</option>
                <option value="verification">Vérifications</option>
                <option value="report">Signalements</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={filters.from}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={filters.to}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Effacer
              </button>
            </div>
          </div>
        )}

        {/* Barre de recherche */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans l'historique..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Vérifications</p>
              <p className="text-2xl font-semibold text-gray-900">
                {history.filter(item => 'verification_type' in item).length}
              </p>
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
              <p className="text-2xl font-semibold text-gray-900">
                {history.filter(item => 'report_type' in item).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste de l'historique */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
        </div>

        {history.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {history.map((item, index) => {
              const status = getItemStatus(item);
              return (
                <div key={item.id || index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getItemIcon(item)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            {getItemType(item)}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {getItemDescription(item)}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(item.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun historique trouvé</p>
            <p className="text-sm text-gray-400">Vos vérifications et signalements apparaîtront ici</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages} ({total} éléments)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianHistoryPage;
