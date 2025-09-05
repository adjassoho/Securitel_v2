import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { policeService } from '@/services/api';
import type { PolicePhoneResult } from '@/types';
import toast from 'react-hot-toast';

const AdvancedSearchPage = () => {
  const [searchForm, setSearchForm] = useState({
    imei: '',
    serial_number: '',
    phone_number: '',
    owner_name: '',
    brand: '',
    model: '',
    color: '',
    status: '',
    date_from: '',
    date_to: '',
    location: '',
    case_reference: '',
  });

  const [searchResults, setSearchResults] = useState<PolicePhoneResult[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const searchMutation = useMutation({
    mutationFn: (data: any) => policeService.searchPhone(data),
    onSuccess: (result: PolicePhoneResult) => {
      setSearchResults([result]);
      if (result.found) {
        toast.success('Recherche effectuée avec succès');
      } else {
        toast('Aucun résultat trouvé', { icon: 'ℹ️' });
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de la recherche');
      console.error('Search error:', error);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty values
    const searchData = Object.entries(searchForm)
      .filter(([_, value]) => value.trim() !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as any);

    if (Object.keys(searchData).length === 0) {
      toast.error('Veuillez remplir au moins un champ de recherche');
      return;
    }

    searchData.search_reason = 'Police investigation';
    searchMutation.mutate(searchData);
  };

  const clearForm = () => {
    setSearchForm({
      imei: '',
      serial_number: '',
      phone_number: '',
      owner_name: '',
      brand: '',
      model: '',
      color: '',
      status: '',
      date_from: '',
      date_to: '',
      location: '',
      case_reference: '',
    });
    setSearchResults([]);
  };

  const exportResults = () => {
    // TODO: Implement export functionality
    toast.success('Export en cours...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recherche avancée</h1>
          <p className="mt-2 text-gray-600">
            Recherche détaillée avec critères multiples
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </button>
          {searchResults.length > 0 && (
            <button
              onClick={exportResults}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </button>
          )}
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de base</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IMEI
                </label>
                <input
                  type="text"
                  value={searchForm.imei}
                  onChange={(e) => handleInputChange('imei', e.target.value)}
                  placeholder="Entrez l'IMEI..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de série
                </label>
                <input
                  type="text"
                  value={searchForm.serial_number}
                  onChange={(e) => handleInputChange('serial_number', e.target.value)}
                  placeholder="Entrez le numéro de série..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  value={searchForm.phone_number}
                  onChange={(e) => handleInputChange('phone_number', e.target.value)}
                  placeholder="Entrez le numéro de téléphone..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriétaire</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du propriétaire
                </label>
                <input
                  type="text"
                  value={searchForm.owner_name}
                  onChange={(e) => handleInputChange('owner_name', e.target.value)}
                  placeholder="Entrez le nom du propriétaire..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Device Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appareil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque
                </label>
                <input
                  type="text"
                  value={searchForm.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  placeholder="Ex: Samsung, iPhone..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle
                </label>
                <input
                  type="text"
                  value={searchForm.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  placeholder="Ex: Galaxy S23, iPhone 14..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur
                </label>
                <input
                  type="text"
                  value={searchForm.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="Ex: Noir, Blanc, Bleu..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres avancés</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={searchForm.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="stolen">Volé</option>
                    <option value="lost">Perdu</option>
                    <option value="found">Retrouvé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={searchForm.date_from}
                    onChange={(e) => handleInputChange('date_from', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={searchForm.date_to}
                    onChange={(e) => handleInputChange('date_to', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Investigation Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'enquête</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu de contrôle
                </label>
                <input
                  type="text"
                  value={searchForm.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ex: Marché de Cotonou, Poste de police..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Référence de dossier
                </label>
                <input
                  type="text"
                  value={searchForm.case_reference}
                  onChange={(e) => handleInputChange('case_reference', e.target.value)}
                  placeholder="Ex: PV-2024-001, Enquête-123..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={searchMutation.isPending}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {searchMutation.isPending ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Rechercher
            </button>

            <button
              type="button"
              onClick={clearForm}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Effacer
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Résultats de la recherche ({searchResults.length})
            </h2>
          </div>

          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {result.found ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span className={`font-medium ${result.found ? 'text-green-600' : 'text-red-600'}`}>
                      {result.found ? 'Téléphone trouvé' : 'Téléphone non trouvé'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700">
                      <FileText className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {result.found && result.phone && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Appareil</h4>
                      <p className="text-sm text-gray-600">{result.phone.brand} {result.phone.model}</p>
                      <p className="text-sm text-gray-600">{result.phone.color}</p>
                      <p className="text-sm text-gray-600 font-mono">{result.phone.imei1}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Propriétaire</h4>
                      <p className="text-sm text-gray-600">{result.phone.owner.name}</p>
                      <p className="text-sm text-gray-600">{result.phone.owner.phone}</p>
                      <p className="text-sm text-gray-600">{result.phone.owner.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Statut</h4>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        result.phone.status === 'active' ? 'bg-green-100 text-green-800' :
                        result.phone.status === 'stolen' ? 'bg-red-100 text-red-800' :
                        result.phone.status === 'lost' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.phone.status}
                      </span>
                      {result.phone.is_stolen && (
                        <div className="mt-2 flex items-center text-red-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="text-xs">Signalé comme volé</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearchPage;
