import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Smartphone,
  Shield,
  Eye,
  FileText,
} from 'lucide-react';
import { policeService } from '@/services/api';
import type { PolicePhoneResult } from '@/types';
import toast from 'react-hot-toast';

const QuickSearchPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<'imei' | 'serial' | 'phone_number'>('imei');
  const [location, setLocation] = useState('');
  const [caseReference, setCaseReference] = useState('');

  const searchMutation = useMutation({
    mutationFn: (data: any) => policeService.searchPhone(data),
    onSuccess: (result: PolicePhoneResult) => {
      if (result.found) {
        toast.success('Téléphone trouvé dans la base de données');
      } else {
        toast('Téléphone non enregistré', { icon: 'ℹ️' });
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de la recherche');
      console.error('Search error:', error);
    },
  });

  const quickVerifyMutation = useMutation({
    mutationFn: (imei: string) => policeService.quickVerify(imei, location),
    onSuccess: (result: PolicePhoneResult) => {
      if (result.found) {
        toast.success('Téléphone trouvé dans la base de données');
      } else {
        toast('Téléphone non enregistré', { icon: 'ℹ️' });
      }
    },
    onError: (error) => {
      toast.error('Erreur lors de la vérification');
      console.error('Quick verify error:', error);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    const searchData = {
      [searchType === 'imei' ? 'imei' : searchType === 'serial' ? 'serial_number' : 'phone_number']: searchValue,
      search_reason: 'Police investigation',
      case_reference: caseReference || undefined,
      location: location || undefined,
    };

    searchMutation.mutate(searchData);
  };

  const handleQuickVerify = () => {
    if (!searchValue.trim()) return;
    quickVerifyMutation.mutate(searchValue);
  };

  const result = searchMutation.data || quickVerifyMutation.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Recherche rapide</h1>
        <p className="mt-2 text-gray-600">
          Vérification instantanée d'IMEI, numéro de série ou numéro de téléphone
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Formulaire de recherche</h2>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de recherche
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="imei">IMEI</option>
                <option value="serial">Numéro de série</option>
                <option value="phone_number">Numéro de téléphone</option>
              </select>
            </div>

            {/* Search Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valeur à rechercher
              </label>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Entrez le ${searchType === 'imei' ? 'IMEI' : searchType === 'serial' ? 'numéro de série' : 'numéro de téléphone'}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lieu de contrôle (optionnel)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Marché de Cotonou, Poste de police..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Case Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Référence de dossier (optionnel)
              </label>
              <input
                type="text"
                value={caseReference}
                onChange={(e) => setCaseReference(e.target.value)}
                placeholder="Ex: PV-2024-001, Enquête-123..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-4">
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
              Recherche détaillée
            </button>

            <button
              type="button"
              onClick={handleQuickVerify}
              disabled={quickVerifyMutation.isPending}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {quickVerifyMutation.isPending ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Shield className="h-4 w-4 mr-2" />
              )}
              Vérification rapide
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Résultat de la recherche</h2>
            <div className="flex items-center">
              {result.found ? (
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500 mr-2" />
              )}
              <span className={`font-medium ${result.found ? 'text-green-600' : 'text-red-600'}`}>
                {result.found ? 'Téléphone trouvé' : 'Téléphone non enregistré'}
              </span>
            </div>
          </div>

          {result.found && result.phone ? (
            <div className="space-y-6">
              {/* Phone Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900 flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    Informations du téléphone
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Marque:</span>
                      <span className="text-sm font-medium">{result.phone.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Modèle:</span>
                      <span className="text-sm font-medium">{result.phone.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Couleur:</span>
                      <span className="text-sm font-medium">{result.phone.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">IMEI 1:</span>
                      <span className="text-sm font-medium font-mono">{result.phone.imei1}</span>
                    </div>
                    {result.phone.imei2 && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">IMEI 2:</span>
                        <span className="text-sm font-medium font-mono">{result.phone.imei2}</span>
                      </div>
                    )}
                    {result.phone.serial_number && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Numéro de série:</span>
                        <span className="text-sm font-medium font-mono">{result.phone.serial_number}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Statut:</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        result.phone.status === 'active' ? 'bg-green-100 text-green-800' :
                        result.phone.status === 'stolen' ? 'bg-red-100 text-red-800' :
                        result.phone.status === 'lost' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.phone.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Propriétaire
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Nom:</span>
                      <span className="text-sm font-medium">{result.phone.owner.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Téléphone:</span>
                      <span className="text-sm font-medium">{result.phone.owner.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Email:</span>
                      <span className="text-sm font-medium">{result.phone.owner.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Enregistré le:</span>
                      <span className="text-sm font-medium">
                        {new Date(result.phone.registration_date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dernière activité:</span>
                      <span className="text-sm font-medium">
                        {new Date(result.phone.last_activity).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theft Report */}
              {result.phone.is_stolen && result.phone.theft_report && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-md font-semibold text-red-900 flex items-center mb-3">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Signalement de vol
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-red-700">Date du vol:</span>
                        <span className="text-sm font-medium">
                          {new Date(result.phone.theft_report.theft_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-red-700">Lieu du vol:</span>
                        <span className="text-sm font-medium">{result.phone.theft_report.theft_location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-red-700">Statut:</span>
                        <span className="text-sm font-medium">{result.phone.theft_report.status}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-red-700">Description:</span>
                      <p className="text-sm text-red-900 mt-1">{result.phone.theft_report.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Status History */}
              {result.phone.status_history && result.phone.status_history.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-gray-900 flex items-center mb-3">
                    <Clock className="h-5 w-5 mr-2" />
                    Historique des statuts
                  </h3>
                  <div className="space-y-2">
                    {result.phone.status_history.slice(0, 5).map((history, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium">{history.status}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(history.changed_at).toLocaleString('fr-FR')}
                          </p>
                          <p className="text-xs text-gray-600">{history.changed_by}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-4 pt-4 border-t border-gray-200">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir l'historique complet
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <FileText className="h-4 w-4 mr-2" />
                  Générer un rapport
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Téléphone non trouvé</h3>
              <p className="text-gray-500">
                Ce {searchType === 'imei' ? 'IMEI' : searchType === 'serial' ? 'numéro de série' : 'numéro de téléphone'} n'est pas enregistré dans notre base de données.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickSearchPage;
