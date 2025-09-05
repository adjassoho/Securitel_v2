import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { technicianService } from '@/services/api';
import {
  Search,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  ArrowLeft,
  MapPin,
  User,
  Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const verificationSchema = z.object({
  imei: z.string().min(15, 'IMEI doit contenir au moins 15 chiffres').max(20, 'IMEI ne peut pas dépasser 20 chiffres'),
  verification_type: z.enum(['purchase', 'repair', 'inspection']),
  location: z.string().min(2, 'Localisation requise'),
  client_name: z.string().optional(),
  client_phone: z.string().optional(),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

const TechnicianVerifyIMEIPage = () => {
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const verifyMutation = useMutation({
    mutationFn: (data: VerificationFormData) => technicianService.verifyIMEI(data),
    onSuccess: (result) => {
      setVerificationResult(result);
      toast.success('Vérification effectuée avec succès !');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la vérification');
    },
  });

  const onSubmit = (data: VerificationFormData) => {
    verifyMutation.mutate(data);
  };

  const handleNewVerification = () => {
    setVerificationResult(null);
    reset();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'stolen':
        return <AlertTriangle className="h-8 w-8 text-red-500" />;
      case 'lost':
        return <AlertTriangle className="h-8 w-8 text-orange-500" />;
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'stolen':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'lost':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Téléphone valide';
      case 'stolen':
        return 'Téléphone volé';
      case 'lost':
        return 'Téléphone perdu';
      default:
        return 'Statut inconnu';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/technician/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vérifier un IMEI</h1>
          <p className="text-gray-600">Vérifiez le statut d'un téléphone avant achat ou réparation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de vérification */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de vérification</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* IMEI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro IMEI *
              </label>
              <input
                {...register('imei')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez le numéro IMEI (15-20 chiffres)"
                maxLength={20}
              />
              {errors.imei && (
                <p className="mt-1 text-sm text-red-600">{errors.imei.message}</p>
              )}
            </div>

            {/* Type de vérification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de vérification *
              </label>
              <select
                {...register('verification_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un type</option>
                <option value="purchase">Achat</option>
                <option value="repair">Réparation</option>
                <option value="inspection">Inspection</option>
              </select>
              {errors.verification_type && (
                <p className="mt-1 text-sm text-red-600">{errors.verification_type.message}</p>
              )}
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation *
              </label>
              <input
                {...register('location')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Abidjan, Cocody"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Informations client (optionnelles) */}
            <div className="border-t pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Informations client (optionnelles)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du client
                  </label>
                  <input
                    {...register('client_name')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom du client"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone du client
                  </label>
                  <input
                    {...register('client_phone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+225 XX XX XX XX"
                  />
                </div>
              </div>
            </div>

            {/* Bouton de vérification */}
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {verifyMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Vérifier l'IMEI
            </button>
          </form>
        </div>

        {/* Résultat de la vérification */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Résultat de la vérification</h2>
          
          {verificationResult ? (
            <div className="space-y-6">
              {/* Statut principal */}
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(verificationResult.status)}`}>
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(verificationResult.status)}
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  {getStatusText(verificationResult.status)}
                </h3>
                <p className="text-center text-sm">
                  {verificationResult.result_details}
                </p>
              </div>

              {/* Détails du téléphone */}
              {verificationResult.phone_details && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Détails du téléphone</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {verificationResult.phone_details.brand} {verificationResult.phone_details.model}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-4 w-4 bg-gray-400 rounded mr-2"></div>
                      <span className="text-sm text-gray-600">
                        Couleur: {verificationResult.phone_details.color}
                      </span>
                    </div>
                    {verificationResult.phone_details.owner_name && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Propriétaire: {verificationResult.phone_details.owner_name}
                        </span>
                      </div>
                    )}
                    {verificationResult.phone_details.owner_phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          Téléphone: {verificationResult.phone_details.owner_phone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informations de vérification */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Informations de vérification</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Search className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      IMEI: {verificationResult.imei}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Vérifié le: {new Date(verificationResult.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      Localisation: {verificationResult.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleNewVerification}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Nouvelle vérification
                </button>
                <button
                  onClick={() => navigate('/technician/history')}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Voir l'historique
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune vérification effectuée</p>
              <p className="text-sm text-gray-400">Entrez un IMEI pour commencer la vérification</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianVerifyIMEIPage;
