import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { phoneService } from '@/services/api';
import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

const ManageStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const { user } = useAuthStore();

  const sendCodeMutation = useMutation({
    mutationFn: async () => {
      // Simuler l'envoi du code par email
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    },
    onSuccess: () => {
      setCodeSent(true);
      toast.success(`Code de vérification envoyé à ${user?.email}`);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: () => phoneService.updatePhoneStatus({ 
      phone_id: id!, 
      status: 'recovered' as const, 
      note, 
      verification_code: verificationCode 
    }),
    onSuccess: () => {
      toast.success('Statut mis à jour avec succès!');
      navigate('/phones');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      toast.error('Veuillez entrer le code de vérification');
      return;
    }
    updateStatusMutation.mutate();
  };

  const handleSendCode = () => {
    sendCodeMutation.mutate();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Gérer le statut</h1>

      <div className="card mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Changement de statut sécurisé
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              Pour des raisons de sécurité, un code de vérification sera envoyé à votre adresse email.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Marquer comme récupéré</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="note" className="label">
              Note (optionnel)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input"
              rows={3}
              placeholder="Ajouter des détails sur la récupération..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Ex: Récupéré à la police, retrouvé dans mon véhicule, etc.
            </p>
          </div>

          <div>
            <label htmlFor="verificationCode" className="label">
              Code de vérification
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="input flex-1"
                placeholder="Entrez le code à 6 chiffres"
                maxLength={6}
                pattern="[0-9]{6}"
                required
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendCodeMutation.isPending || codeSent}
                className="btn-outline"
              >
                <Mail className="h-4 w-4 mr-2" />
                {codeSent ? 'Code envoyé' : 'Envoyer le code'}
              </button>
            </div>
            {codeSent && (
              <p className="mt-1 text-sm text-green-600">
                Code envoyé à {user?.email}
              </p>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Action : Marquer comme récupéré
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Cette action changera le statut du téléphone de "Volé" ou "Perdu" à "Récupéré".
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/phones')}
              className="btn-outline flex-1"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={updateStatusMutation.isPending || !codeSent}
              className="btn-primary flex-1"
            >
              {updateStatusMutation.isPending ? 'Mise à jour...' : 'Confirmer la récupération'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageStatusPage;
