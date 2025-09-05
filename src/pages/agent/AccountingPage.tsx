import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import type { WithdrawalRequest } from '@/types';
import {
  DollarSign,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  AlertTriangle,
  Copy,
  Calendar,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';

const AccountingPage = () => {
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalRequest>({
    amount: 0,
    method: 'mtn',
    phone_number: '',
    beneficiary_name: '',
  });

  // Récupération des statistiques
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: agentService.getStats,
  });

  // Récupération des retraits
  const { data: withdrawals, isLoading: withdrawalsLoading, refetch: refetchWithdrawals } = useQuery({
    queryKey: ['agent-withdrawals'],
    queryFn: agentService.getWithdrawals,
  });

  // Mutation pour créer une demande de retrait
  const createWithdrawalMutation = useMutation({
    mutationFn: agentService.requestWithdrawal,
    onSuccess: () => {
      toast.success('Demande de retrait envoyée avec succès');
      setShowWithdrawalModal(false);
      setWithdrawalData({
        amount: 0,
        method: 'mtn',
        phone_number: '',
        beneficiary_name: '',
      });
      refetchWithdrawals();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la demande de retrait');
    },
  });

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (withdrawalData.amount < 2000) {
      toast.error('Le montant minimum de retrait est de 2000 FCFA');
      return;
    }

    if (withdrawalData.amount > (stats?.available_balance || 0)) {
      toast.error('Le montant demandé dépasse votre solde disponible');
      return;
    }

    if (!withdrawalData.phone_number || !withdrawalData.beneficiary_name) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    createWithdrawalMutation.mutate(withdrawalData);
  };

  const copyReferralLink = () => {
    if (stats?.referral_link) {
      navigator.clipboard.writeText(stats.referral_link);
      toast.success('Lien de parrainage copié dans le presse-papiers');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comptabilité</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos revenus, commissions et demandes de retrait
          </p>
        </div>
        <button
          onClick={() => setShowWithdrawalModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Demande de retrait
        </button>
      </div>

      {/* Statistiques financières */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Wallet className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Solde Disponible</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.available_balance?.toLocaleString('fr-FR') || 0} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Gains Totaux</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_revenue?.toLocaleString('fr-FR') || 0} FCFA
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Enregistrements Validés</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.validated_registrations || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lien de parrainage */}
      {stats?.referral_link && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Lien de Parrainage</h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Votre lien unique</p>
              <p className="font-mono text-sm break-all">{stats.referral_link}</p>
            </div>
            <button
              onClick={copyReferralLink}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copier</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Partagez ce lien pour gagner des commissions sur les enregistrements de vos parrainés
          </p>
        </div>
      )}

      {/* Historique des retraits */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historique des Retraits</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {withdrawalsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : withdrawals && withdrawals.length > 0 ? (
            withdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {withdrawal.method === 'mtn' ? (
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-yellow-600" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {withdrawal.amount.toLocaleString('fr-FR')} FCFA
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(withdrawal.status)}`}>
                          {getStatusIcon(withdrawal.status)}
                          <span className="ml-1">{getStatusText(withdrawal.status)}</span>
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(withdrawal.requested_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="flex items-center">
                          {withdrawal.method === 'mtn' ? 'MTN Mobile Money' : 'Moov Money'}
                        </span>
                      </div>
                      {withdrawal.admin_comment && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Commentaire:</strong> {withdrawal.admin_comment}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {withdrawal.processed_at && (
                        <span>Traité le {new Date(withdrawal.processed_at).toLocaleDateString('fr-FR')}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun retrait effectué</h3>
              <p className="text-gray-500">Commencez par faire une demande de retrait</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de demande de retrait */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Demande de Retrait
            </h3>
            
            <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (FCFA)
                </label>
                <input
                  type="number"
                  value={withdrawalData.amount}
                  onChange={(e) => setWithdrawalData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  min="2000"
                  max={stats?.available_balance || 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: 2000 FCFA | Maximum: {stats?.available_balance?.toLocaleString('fr-FR')} FCFA
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de retrait
                </label>
                <select
                  value={withdrawalData.method}
                  onChange={(e) => setWithdrawalData(prev => ({ ...prev, method: e.target.value as 'mtn' | 'moov' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="moov">Moov Money</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={withdrawalData.phone_number}
                  onChange={(e) => setWithdrawalData(prev => ({ ...prev, phone_number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="07 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du bénéficiaire
                </label>
                <input
                  type="text"
                  value={withdrawalData.beneficiary_name}
                  onChange={(e) => setWithdrawalData(prev => ({ ...prev, beneficiary_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom complet"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createWithdrawalMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {createWithdrawalMutation.isPending ? 'Envoi...' : 'Envoyer la demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingPage;
