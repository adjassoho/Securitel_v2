import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Smartphone,
  Filter,
  Edit,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  User,
  Calendar,
  Phone,
} from 'lucide-react';
import { adminService } from '@/services/api';
import type { AdminPhone } from '@/types';
import toast from 'react-hot-toast';

const PhonesPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    brand: '',
    search: '',
    date_from: '',
    date_to: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedPhone, setSelectedPhone] = useState<AdminPhone | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-phones', filters, page, limit],
    queryFn: () => adminService.getPhones({
      ...filters,
      page,
      limit,
    }),
  });

  // const updatePhoneStatusMutation = useMutation({
  //   mutationFn: ({ phoneId, status, note }: { phoneId: string; status: string; note?: string }) => 
  //     adminService.updatePhoneStatus(phoneId, status, note),
  //   onSuccess: () => {
  //     toast.success('Statut du téléphone mis à jour');
  //     refetch();
  //   },
  //   onError: () => {
  //     toast.error('Erreur lors de la mise à jour');
  //   },
  // });

  const addToBlacklistMutation = useMutation({
    mutationFn: (phoneId: string) => adminService.addToBlacklist(phoneId, 'Ajouté à la liste noire par admin'),
    onSuccess: () => {
      toast.success('Téléphone ajouté à la liste noire');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors de l\'ajout à la liste noire');
    },
  });

  const removeFromBlacklistMutation = useMutation({
    mutationFn: (phoneId: string) => adminService.removeFromBlacklist(phoneId),
    onSuccess: () => {
      toast.success('Téléphone retiré de la liste noire');
      refetch();
    },
    onError: () => {
      toast.error('Erreur lors du retrait de la liste noire');
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
      brand: '',
      search: '',
      date_from: '',
      date_to: '',
    });
    setPage(1);
  };

  // const handleUpdateStatus = (phoneId: string, status: string) => {
  //   const note = prompt('Note (optionnelle):');
  //   updatePhoneStatusMutation.mutate({ phoneId, status, note: note || undefined });
  // };

  const handleAddToBlacklist = (phoneId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir ajouter ce téléphone à la liste noire ?')) {
      addToBlacklistMutation.mutate(phoneId);
    }
  };

  const handleRemoveFromBlacklist = (phoneId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir retirer ce téléphone de la liste noire ?')) {
      removeFromBlacklistMutation.mutate(phoneId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'stolen':
        return 'bg-red-100 text-red-800';
      case 'lost':
        return 'bg-yellow-100 text-yellow-800';
      case 'found':
        return 'bg-blue-100 text-blue-800';
      case 'blacklisted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'stolen':
        return <AlertTriangle className="h-4 w-4" />;
      case 'lost':
        return <XCircle className="h-4 w-4" />;
      case 'found':
        return <CheckCircle className="h-4 w-4" />;
      case 'blacklisted':
        return <Shield className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
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
        <p className="text-gray-500 mb-4">Impossible de charger les téléphones</p>
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

  const phones = data?.phones || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des téléphones</h1>
          <p className="mt-2 text-gray-600">
            Gérer tous les téléphones enregistrés sur la plateforme
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </button>
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
                <option value="active">Actif</option>
                <option value="stolen">Volé</option>
                <option value="lost">Perdu</option>
                <option value="found">Retrouvé</option>
                <option value="blacklisted">Liste noire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque
              </label>
              <input
                type="text"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                placeholder="Samsung, iPhone, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="IMEI, modèle, propriétaire..."
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
            <Smartphone className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total téléphones</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {phones.filter(p => p.status === 'legitimate').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Volés</p>
              <p className="text-2xl font-bold text-gray-900">
                {phones.filter(p => p.status === 'stolen').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-gray-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Liste noire</p>
              <p className="text-2xl font-bold text-gray-900">
                {phones.filter(p => p.status === 'stolen').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Phones List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Téléphones ({total})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {phones.length === 0 ? (
            <div className="text-center py-12">
              <Smartphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun téléphone trouvé</h3>
              <p className="text-gray-500">Aucun téléphone ne correspond aux critères sélectionnés</p>
            </div>
          ) : (
            phones.map((phone) => (
              <div key={phone.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        <Smartphone className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {phone.brand} {phone.model}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phone.status)}`}>
                          {getStatusIcon(phone.status)}
                          <span className="ml-1">{phone.status}</span>
                        </span>
                        {phone.status === 'stolen' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Volé
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">IMEI 1:</span> {phone.imei1}
                          </div>
                          {phone.imei2 && (
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">IMEI 2:</span> {phone.imei2}
                            </div>
                          )}
                          {phone.serial_number && (
                            <div className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">S/N:</span> {phone.serial_number}
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Couleur:</span> Non spécifiée
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <User className="h-4 w-4 mr-2" />
                            {phone.owner.first_name} {phone.owner.last_name}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Phone className="h-4 w-4 mr-2" />
                            {phone.owner.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            Enregistré le {new Date(phone.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          {phone.last_activity && (
                            <div className="flex items-center text-sm text-gray-600">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Dernière activité: {new Date(phone.last_activity).toLocaleDateString('fr-FR')}
                            </div>
                          )}
                        </div>
                      </div>

                      {phone.status_history && phone.status_history.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">Historique des statuts</h5>
                          <div className="space-y-1">
                            {phone.status_history.slice(0, 3).map((history, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">{history.status}</span>
                                <span className="text-gray-500">
                                  {new Date(history.changed_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedPhone(phone)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    {phone.status === 'stolen' ? (
                      <button
                        onClick={() => handleRemoveFromBlacklist(phone.id)}
                        className="p-2 text-green-400 hover:text-green-600 transition-colors"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToBlacklist(phone.id)}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
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

      {/* Phone Details Modal */}
      {selectedPhone && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedPhone(null)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Détails du téléphone
                    </h3>
                    <div className="mt-4 space-y-2">
                      <p><strong>Appareil:</strong> {selectedPhone.brand} {selectedPhone.model}</p>
                      <p><strong>Couleur:</strong> Non spécifiée</p>
                      <p><strong>IMEI 1:</strong> {selectedPhone.imei1}</p>
                      {selectedPhone.imei2 && <p><strong>IMEI 2:</strong> {selectedPhone.imei2}</p>}
                      {selectedPhone.serial_number && <p><strong>Numéro de série:</strong> {selectedPhone.serial_number}</p>}
                      <p><strong>Statut:</strong> {selectedPhone.status}</p>
                      <p><strong>Propriétaire:</strong> {selectedPhone.owner.first_name} {selectedPhone.owner.last_name}</p>
                      <p><strong>Email:</strong> {selectedPhone.owner.email}</p>
                      <p><strong>Téléphone:</strong> {selectedPhone.owner.phone}</p>
                      <p><strong>Enregistré le:</strong> {new Date(selectedPhone.created_at).toLocaleDateString('fr-FR')}</p>
                      {selectedPhone.last_activity && (
                        <p><strong>Dernière activité:</strong> {new Date(selectedPhone.last_activity).toLocaleDateString('fr-FR')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setSelectedPhone(null)}
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

export default PhonesPage;
