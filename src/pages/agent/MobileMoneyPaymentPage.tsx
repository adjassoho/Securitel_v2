import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import {
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Shield,
  DollarSign,
  AlertCircle,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentData {
  amount: number;
  phone_number: string;
  payment_method: 'mtn' | 'moov' | 'orange';
  description: string;
  reference: string;
}

interface PaymentStatus {
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  transaction_id?: string;
  message?: string;
  verification_code?: string;
}

const MobileMoneyPaymentPage = () => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 1500,
    phone_number: '',
    payment_method: 'mtn',
    description: 'Enregistrement de téléphone SecuriTels',
    reference: '',
  });
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Génération automatique de référence
  useEffect(() => {
    const reference = `SEC${Date.now()}${Math.floor(Math.random() * 1000)}`;
    setPaymentData(prev => ({ ...prev, reference }));
  }, []);

  // Countdown pour le statut pending
  useEffect(() => {
    if (paymentStatus?.status === 'pending' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [paymentStatus, countdown]);

  // Mutation pour initier le paiement
  const initiatePaymentMutation = useMutation({
    mutationFn: agentService.initiateMobileMoneyPayment,
    onSuccess: (response) => {
      setPaymentStatus({
        status: 'pending',
        transaction_id: response.transaction_id,
        message: 'Paiement initié. Vérifiez votre téléphone pour confirmer.',
        verification_code: response.verification_code,
      });
      setCountdown(300); // 5 minutes
      toast.success('Paiement initié avec succès');
    },
    onError: (error: any) => {
      setPaymentStatus({
        status: 'failed',
        message: error.response?.data?.message || 'Erreur lors de l\'initiation du paiement',
      });
      toast.error('Erreur lors de l\'initiation du paiement');
    },
  });

  // Mutation pour vérifier le statut du paiement
  const checkPaymentStatusMutation = useMutation({
    mutationFn: (transactionId: string) => agentService.checkPaymentStatus(transactionId),
    onSuccess: (response) => {
      setPaymentStatus({
        status: response.status,
        transaction_id: response.transaction_id,
        message: response.message,
      });
      
      if (response.status === 'success') {
        toast.success('Paiement effectué avec succès !');
      } else if (response.status === 'failed') {
        toast.error('Paiement échoué');
      }
    },
    onError: () => {
      toast.error('Erreur lors de la vérification du paiement');
    },
  });

  const handlePayment = () => {
    if (!paymentData.phone_number) {
      toast.error('Veuillez saisir votre numéro de téléphone');
      return;
    }

    setIsProcessing(true);
    initiatePaymentMutation.mutate(paymentData);
  };

  const handleCheckStatus = () => {
    if (paymentStatus?.transaction_id) {
      checkPaymentStatusMutation.mutate(paymentStatus.transaction_id);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'failed':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Paiement Réussi';
      case 'failed':
        return 'Paiement Échoué';
      case 'pending':
        return 'En Attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Paiement Mobile Money</h1>
        <p className="mt-2 text-gray-600">
          Effectuez votre paiement de 1 500 FCFA via Mobile Money
        </p>
      </div>

      {/* Informations de paiement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Détails du Paiement</h2>
          <div className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
            <DollarSign className="h-6 w-6" />
            <span>1 500 FCFA</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de Téléphone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={paymentData.phone_number}
              onChange={(e) => setPaymentData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+225 XX XX XX XX XX"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Méthode de Paiement <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'mtn', label: 'MTN Mobile Money', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
                { value: 'moov', label: 'Moov Money', color: 'bg-blue-100 text-blue-800 border-blue-300' },
                { value: 'orange', label: 'Orange Money', color: 'bg-orange-100 text-orange-800 border-orange-300' },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentData.payment_method === method.value
                      ? method.color
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={method.value}
                    checked={paymentData.payment_method === method.value}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, payment_method: e.target.value as any }))}
                    className="sr-only"
                    disabled={isProcessing}
                  />
                  <div className="text-center">
                    <div className="font-medium text-sm">{method.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={paymentData.description}
              onChange={(e) => setPaymentData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Référence de Transaction
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={paymentData.reference}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentData.reference);
                  toast.success('Référence copiée');
                }}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handlePayment}
            disabled={isProcessing || !paymentData.phone_number}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Initialisation...</span>
              </>
            ) : (
              <>
                <Smartphone className="h-5 w-5" />
                <span>Payer avec Mobile Money</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Statut du paiement */}
      {paymentStatus && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Statut du Paiement</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(paymentStatus.status)}`}>
              {getStatusIcon(paymentStatus.status)}
              <span className="ml-2">{getStatusText(paymentStatus.status)}</span>
            </span>
          </div>

          {paymentStatus.message && (
            <p className="text-gray-600 mb-4">{paymentStatus.message}</p>
          )}

          {paymentStatus.status === 'pending' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">En attente de confirmation</span>
                </div>
                <p className="text-sm text-yellow-700 mb-2">
                  Vérifiez votre téléphone et confirmez le paiement dans l'application Mobile Money.
                </p>
                {countdown > 0 && (
                  <p className="text-sm text-yellow-600">
                    Temps restant : <span className="font-mono font-bold">{formatTime(countdown)}</span>
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCheckStatus}
                  disabled={checkPaymentStatusMutation.isPending}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${checkPaymentStatusMutation.isPending ? 'animate-spin' : ''}`} />
                  <span>Vérifier le Statut</span>
                </button>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {paymentStatus.status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Paiement Confirmé</span>
              </div>
              <p className="text-sm text-green-700">
                Votre paiement a été effectué avec succès. Vous pouvez maintenant continuer avec l'enregistrement.
              </p>
            </div>
          )}

          {paymentStatus.status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Paiement Échoué</span>
              </div>
              <p className="text-sm text-red-700 mb-3">
                Le paiement n'a pas pu être effectué. Veuillez réessayer.
              </p>
              <button
                onClick={() => setPaymentStatus(null)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Instructions de Paiement</h3>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5">1</div>
            <p>Saisissez votre numéro de téléphone Mobile Money</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5">2</div>
            <p>Sélectionnez votre opérateur (MTN, Moov, Orange)</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5">3</div>
            <p>Cliquez sur "Payer avec Mobile Money"</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5">4</div>
            <p>Confirmez le paiement dans l'application Mobile Money</p>
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-gray-900">Sécurité</h4>
            <p className="text-sm text-gray-600 mt-1">
              Tous les paiements sont sécurisés et chiffrés. Aucune information de paiement n'est stockée sur nos serveurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMoneyPaymentPage;
