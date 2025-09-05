import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { technicianService } from '@/services/api';
import {
  AlertTriangle,
  Search,
  User,
  Phone,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  Smartphone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const reportSchema = z.object({
  imei: z.string().min(15, 'IMEI doit contenir au moins 15 chiffres').max(20, 'IMEI ne peut pas dépasser 20 chiffres'),
  phone_brand: z.string().min(2, 'Marque requise'),
  phone_model: z.string().min(2, 'Modèle requis'),
  description: z.string().min(10, 'Description doit contenir au moins 10 caractères'),
  location: z.string().min(2, 'Localisation requise'),
  client_name: z.string().optional(),
  client_phone: z.string().optional(),
  report_type: z.enum(['theft', 'suspicious', 'found']),
});

type ReportFormData = z.infer<typeof reportSchema>;

const TechnicianReportTheftPage = () => {
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      report_type: 'theft',
    },
  });

  const watchedImei = watch('imei');

  const searchPhoneMutation = useMutation({
    mutationFn: async (imei: string) => {
      // Simulation de recherche de téléphone
      setSearching(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSearching(false);
      
      // Retourner des données simulées
      return {
        id: 'phone_' + imei,
        imei: imei,
        brand: 'Samsung',
        model: 'Galaxy S21',
        owner_name: 'Jean Dupont',
        owner_phone: '+225 07 12 34 56 78',
        status: 'registered',
      };
    },
    onSuccess: (result) => {
      setSearchResult(result);
      setValue('phone_brand', result.brand);
      setValue('phone_model', result.model);
      toast.success('Téléphone trouvé !');
    },
    onError: () => {
      toast.error('Téléphone non trouvé dans la base de données');
    },
  });

  const reportMutation = useMutation({
    mutationFn: (data: ReportFormData) => {
      const reportData = {
        phone_id: searchResult?.id || 'unknown',
        description: data.description,
        location: data.location,
        client_name: data.client_name,
        client_phone: data.client_phone,
      };

      switch (data.report_type) {
        case 'theft':
          return technicianService.reportTheft(reportData);
        case 'suspicious':
          return technicianService.reportSuspicious(reportData);
        case 'found':
          return technicianService.reportFound(reportData);
        default:
          throw new Error('Type de signalement invalide');
      }
    },
    onSuccess: () => {
      toast.success('Signalement envoyé avec succès !');
      reset();
      setSearchResult(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi du signalement');
    },
  });

  const handleSearchPhone = () => {
    if (watchedImei && watchedImei.length >= 15) {
      searchPhoneMutation.mutate(watchedImei);
    } else {
      toast.error('Veuillez entrer un IMEI valide (15-20 chiffres)');
    }
  };

  const onSubmit = (data: ReportFormData) => {
    if (!searchResult) {
      toast.error('Veuillez d\'abord rechercher le téléphone');
      return;
    }
    reportMutation.mutate(data);
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'theft':
        return 'Vol';
      case 'suspicious':
        return 'Suspect';
      case 'found':
        return 'Retrouvé';
      default:
        return 'Inconnu';
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'theft':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'suspicious':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'found':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Signaler un vol</h1>
          <p className="text-gray-600">Signalez un téléphone volé, suspect ou retrouvé</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de signalement */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du signalement</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Type de signalement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de signalement *
              </label>
              <select
                {...register('report_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="theft">Vol</option>
                <option value="suspicious">Suspect</option>
                <option value="found">Retrouvé</option>
              </select>
              {errors.report_type && (
                <p className="mt-1 text-sm text-red-600">{errors.report_type.message}</p>
              )}
            </div>

            {/* Recherche IMEI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro IMEI *
              </label>
              <div className="flex space-x-2">
                <input
                  {...register('imei')}
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le numéro IMEI"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={handleSearchPhone}
                  disabled={searching || !watchedImei || watchedImei.length < 15}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {searching ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.imei && (
                <p className="mt-1 text-sm text-red-600">{errors.imei.message}</p>
              )}
            </div>

            {/* Marque et modèle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque *
                </label>
                <input
                  {...register('phone_brand')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Samsung, iPhone, etc."
                />
                {errors.phone_brand && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_brand.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle *
                </label>
                <input
                  {...register('phone_model')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Galaxy S21, iPhone 13, etc."
                />
                {errors.phone_model && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone_model.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez les circonstances du vol, les détails du téléphone, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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
                placeholder="Ex: Abidjan, Cocody, Riviera 2"
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

            {/* Bouton de signalement */}
            <button
              type="submit"
              disabled={reportMutation.isPending || !searchResult}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {reportMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              Envoyer le signalement
            </button>
          </form>
        </div>

        {/* Résultat de la recherche et aperçu */}
        <div className="space-y-6">
          {/* Résultat de la recherche */}
          {searchResult && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Téléphone trouvé</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {searchResult.brand} {searchResult.model}
                    </p>
                    <p className="text-xs text-gray-500">IMEI: {searchResult.imei}</p>
                  </div>
                </div>

                {searchResult.owner_name && (
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {searchResult.owner_name}
                      </p>
                      <p className="text-xs text-gray-500">Propriétaire enregistré</p>
                    </div>
                  </div>
                )}

                {searchResult.owner_phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {searchResult.owner_phone}
                      </p>
                      <p className="text-xs text-gray-500">Téléphone du propriétaire</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Téléphone enregistré
                    </p>
                    <p className="text-xs text-gray-500">Dans la base de données SecuriTel</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aperçu du signalement */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu du signalement</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReportTypeColor(watch('report_type'))}`}>
                  {getReportTypeLabel(watch('report_type'))}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">IMEI:</span>
                <span className="text-sm font-medium text-gray-900">
                  {watch('imei') || 'Non renseigné'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Téléphone:</span>
                <span className="text-sm font-medium text-gray-900">
                  {watch('phone_brand')} {watch('phone_model') || 'Non renseigné'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Localisation:</span>
                <span className="text-sm font-medium text-gray-900">
                  {watch('location') || 'Non renseignée'}
                </span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Instructions</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Vérifiez d'abord l'IMEI du téléphone</p>
              <p>• Renseignez tous les détails nécessaires</p>
              <p>• Le signalement sera transmis aux autorités compétentes</p>
              <p>• Vous recevrez une confirmation par email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianReportTheftPage;
