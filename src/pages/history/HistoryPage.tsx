import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { historyService } from '@/services/api';
import {
  Clock,
  Activity,
  Shield,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

interface HistoryFilters {
  from?: string;
  to?: string;
  type?: string;
  search?: string;
}

const HistoryPage = () => {
  const [filters, setFilters] = useState<HistoryFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: historyItems,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['history', filters],
    queryFn: () => historyService.getHistory(filters),
    staleTime: 30000, // 30 secondes
    retry: 3, // Retry 3 fois en cas d'erreur
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Délai exponentiel
  });

  // Gestion des erreurs avec useEffect
  React.useEffect(() => {
    if (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    }
  }, [error]);

  const actionTypeConfig = {
    registration: {
      icon: Smartphone,
      label: 'Enregistrement',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    verification: {
      icon: Eye,
      label: 'Vérification',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    status_change: {
      icon: AlertTriangle,
      label: 'Changement de statut',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700'
    },
    transfer: {
      icon: ArrowRight,
      label: 'Transfert',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700'
    },
    report: {
      icon: Shield,
      label: 'Signalement',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleFilterChange = (key: keyof HistoryFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const exportHistory = () => {
    if (!historyItems || !Array.isArray(historyItems) || historyItems.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    const csvContent = [
      ['Date', 'Type', 'Description', 'IMEI'].join(','),
      ...historyItems.map(item => [
        new Date(item.created_at).toLocaleDateString('fr-FR'),
        (actionTypeConfig as any)[item.action_type]?.label || item.action_type,
        `"${item.description}"`,
        item.phone_imei || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `historique_securitel_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Historique exporté avec succès!');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredItems = historyItems && Array.isArray(historyItems) ? historyItems.filter(item => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      item.description.toLowerCase().includes(searchLower) ||
      item.phone_imei?.toLowerCase().includes(searchLower) ||
      (actionTypeConfig as any)[item.action_type]?.label.toLowerCase().includes(searchLower)
    );
  }) : [];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h2>
            <p className="text-gray-600 mb-2">Impossible de charger l'historique des activités</p>
            <p className="text-sm text-gray-500 mb-6">
              {error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Réessayer
            </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-700 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition-all duration-300"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Recharger la page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header avec glass morphism */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 mx-auto w-fit">
                <Clock className="h-16 w-16 text-blue-600 mx-auto" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Historique des activités
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Consultez l'historique complet de toutes vos actions sur la plateforme SecuriTel
            </p>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Barre de recherche */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher dans l'historique..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none hover:border-gray-400 text-gray-900"
                  />
                </div>
              </form>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                  showFilters
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/90 backdrop-blur-sm text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                }`}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </button>
              
              <button
                onClick={exportHistory}
                disabled={!filteredItems || !Array.isArray(filteredItems) || filteredItems.length === 0}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-5 w-5 mr-2" />
                Exporter
              </button>
              
              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-700 border-2 border-gray-300 rounded-xl font-medium transition-all duration-300 hover:border-gray-400 hover:scale-105 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </button>
            </div>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-6 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={filters.from || ''}
                    onChange={(e) => handleFilterChange('from', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none hover:border-gray-400 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={filters.to || ''}
                    onChange={(e) => handleFilterChange('to', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none hover:border-gray-400 text-gray-900"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'action
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white/90 backdrop-blur-sm transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none hover:border-gray-400 text-gray-900"
                  >
                    <option value="">Tous les types</option>
                    <option value="registration">Enregistrement</option>
                    <option value="verification">Vérification</option>
                    <option value="status_change">Changement de statut</option>
                    <option value="transfer">Transfert</option>
                    <option value="report">Signalement</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                >
                  Effacer les filtres
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Liste des activités */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de l'historique...</p>
              </div>
            </div>
          ) : !filteredItems || !Array.isArray(filteredItems) || filteredItems.length === 0 ? (
            <div className="text-center p-12">
              <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune activité trouvée
              </h3>
              <p className="text-gray-600">
                {filters.search || filters.from || filters.to || filters.type
                  ? 'Aucune activité ne correspond à vos critères de recherche'
                  : 'Vous n\'avez pas encore d\'activité enregistrée'}
              </p>
              {(filters.search || filters.from || filters.to || filters.type) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  Effacer les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200/50">
              {Array.isArray(filteredItems) && filteredItems.map((item) => {
                const config = (actionTypeConfig as any)[item.action_type];
                const IconComponent = config?.icon || Activity;
                const { date, time } = formatDate(item.created_at);
                
                return (
                  <div
                    key={item.id}
                    className="p-6 hover:bg-white/40 transition-all duration-300 group"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Icône d'action */}
                      <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-r ${config?.color || 'from-gray-500 to-gray-600'} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Contenu principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config?.bgColor || 'bg-gray-100'} ${config?.textColor || 'text-gray-700'}`}>
                                {config?.label || item.action_type}
                              </span>
                              {item.phone_imei && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  <Smartphone className="h-3 w-3 mr-1" />
                                  IMEI: {item.phone_imei}
                                </span>
                              )}
                            </div>
                            
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                              {item.description}
                            </h3>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {time}
                              </div>
                            </div>
                          </div>
                          
                          {/* Badge de statut */}
                          <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Statistiques en bas */}
        {filteredItems && Array.isArray(filteredItems) && filteredItems.length > 0 && (
          <div className="mt-8 bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(actionTypeConfig).map(([type, config]) => {
                const count = filteredItems.filter(item => item.action_type === type).length;
                const IconComponent = config.icon;
                
                return (
                  <div key={type} className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 hover:scale-105 transition-all duration-300">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${config.color} flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600">{config.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
