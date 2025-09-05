import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import {
  Users,
  Filter,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Award,
  Eye,
} from 'lucide-react';

interface ReferralUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  status: 'active' | 'inactive' | 'pending';
  registration_date: string;
  total_phones_registered: number;
  total_commission_earned: number;
  last_activity: string;
}

const ReferralsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    date_from: '',
    date_to: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Récupération des parrainés
  const { data: referrals, isLoading, error, refetch } = useQuery({
    queryKey: ['agent-referrals', filters],
    queryFn: () => agentService.getReferrals({
      search: filters.search || undefined,
      status: filters.status || undefined,
      from: filters.date_from || undefined,
      to: filters.date_to || undefined,
    }),
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
      status: '',
      date_from: '',
      date_to: '',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  const filteredReferrals = referrals?.filter((referral: ReferralUser) => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        referral.first_name.toLowerCase().includes(searchTerm) ||
        referral.last_name.toLowerCase().includes(searchTerm) ||
        referral.email.toLowerCase().includes(searchTerm) ||
        referral.phone.includes(searchTerm)
      );
    }
    return true;
  }) || [];

  const totalCommission = filteredReferrals.reduce((sum: number, referral: ReferralUser) => 
    sum + (referral.total_commission_earned || 0), 0
  );

  const activeReferrals = filteredReferrals.filter((r: ReferralUser) => r.status === 'active').length;

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
        <p className="text-gray-500 mb-4">Impossible de charger vos parrainés</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Mes Parrainés</h1>
          <p className="mt-2 text-gray-600">
            Gérez et suivez vos parrainés et leurs performances
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
        </div>
      </div>

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
                placeholder="Nom, email, téléphone..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="pending">En attente</option>
              </select>
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

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Parrainés</p>
              <p className="text-2xl font-bold text-gray-900">{filteredReferrals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Parrainés Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{activeReferrals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Commissions Totales</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalCommission.toLocaleString('fr-FR')} FCFA
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des parrainés */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Parrainés ({filteredReferrals.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReferrals.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun parrainé trouvé</h3>
              <p className="text-gray-500">Commencez à partager votre lien de parrainage</p>
            </div>
          ) : (
            filteredReferrals.map((referral: ReferralUser) => (
              <div key={referral.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-medium">
                        {referral.first_name[0]}{referral.last_name[0]}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {referral.first_name} {referral.last_name}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(referral.status)}`}>
                          {getStatusIcon(referral.status)}
                          <span className="ml-1">{getStatusText(referral.status)}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Mail className="h-4 w-4 mr-2" />
                            {referral.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Phone className="h-4 w-4 mr-2" />
                            {referral.phone}
                          </div>
                          {referral.address && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {referral.address}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            Parrainé le {new Date(referral.registration_date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <Award className="h-4 w-4 mr-2" />
                            {referral.total_phones_registered} téléphone(s) enregistré(s)
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {referral.total_commission_earned?.toLocaleString('fr-FR') || 0} FCFA de commission
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Dernière activité : {new Date(referral.last_activity).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
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

export default ReferralsPage;
