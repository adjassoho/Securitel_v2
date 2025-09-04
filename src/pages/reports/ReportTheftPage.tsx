import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ShieldX, Calendar, MapPin, FileText, AlertTriangle, ChevronLeft } from 'lucide-react';
import { phoneService, reportService } from '@/services/api';

const reportTheftSchema = z.object({
  phoneId: z.string().min(1, 'Veuillez sélectionner un téléphone'),
  theftDate: z.string().min(1, 'La date du vol est requise'),
  theftTime: z.string().optional(),
  location: z.string().min(5, 'Veuillez décrire le lieu du vol'),
  circumstances: z.string().min(20, 'Veuillez décrire les circonstances du vol (minimum 20 caractères)'),
  complaintNumber: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type ReportTheftForm = z.infer<typeof reportTheftSchema>;

const ReportTheftPage = () => {
  const navigate = useNavigate();
  const [selectedPhone, setSelectedPhone] = useState<any>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ReportTheftForm>({
    resolver: zodResolver(reportTheftSchema),
  });

  // Récupérer les téléphones de l'utilisateur
  const { data: phones, isLoading: phonesLoading } = useQuery({
    queryKey: ['userPhones'],
    queryFn: phoneService.getMyPhones,
  });

  const reportTheftMutation = useMutation({
    mutationFn: (data: ReportTheftForm) => reportService.reportTheft({
      phone_id: data.phoneId,
      theft_date: `${data.theftDate}${data.theftTime ? 'T' + data.theftTime : ''}`,
      theft_location: data.location,
      description: data.circumstances,
      emergency_contact: '', // You may want to add this field to the form
      verification_code: '', // You may want to add this field too
    }),
    onSuccess: () => {
      toast.success('Vol signalé avec succès');
      navigate('/phones');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du signalement');
    },
  });

  const onSubmit = (data: ReportTheftForm) => {
    reportTheftMutation.mutate(data);
  };

  const handlePhoneSelect = (phoneId: string) => {
    const phone = phones?.find((p: any) => p.id === phoneId);
    setSelectedPhone(phone);
    setValue('phoneId', phoneId);
  };

  if (phonesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const activePhones = phones?.filter((phone: any) => phone.status === 'legitimate') || [];

  if (activePhones.length === 0) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun Telephone enregistré</h3>
          <p className="mt-2 text-sm text-gray-600">
            Vous n'avez Aucun Telephone enregistré à signaler comme volé.
          </p>
          <button
            onClick={() => navigate('/phones')}
            className="mt-4 btn-primary"
          >
            Retour à mes téléphones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Retour
        </button>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <ShieldX className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Signaler un vol</h1>
                <p className="text-gray-600">Déclarez le vol de votre téléphone pour le bloquer</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Sélection du téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone volé *
              </label>
              <select
                {...register('phoneId')}
                onChange={(e) => handlePhoneSelect(e.target.value)}
                className="form-select"
              >
                <option value="">Sélectionnez un téléphone</option>
                {activePhones.map((phone: any) => (
                  <option key={phone.id} value={phone.id}>
                    {phone.brand} {phone.model} - IMEI: {phone.imei}
                  </option>
                ))}
              </select>
              {errors.phoneId && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneId.message}</p>
              )}

              {selectedPhone && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Marque:</span> {selectedPhone.brand}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Modèle:</span> {selectedPhone.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">IMEI:</span> {selectedPhone.imei}
                  </p>
                </div>
              )}
            </div>

            {/* Date et heure du vol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date du vol *
                </label>
                <input
                  type="date"
                  {...register('theftDate')}
                  max={new Date().toISOString().split('T')[0]}
                  className="form-input"
                />
                {errors.theftDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.theftDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure approximative
                </label>
                <input
                  type="time"
                  {...register('theftTime')}
                  className="form-input"
                />
              </div>
            </div>

            {/* Lieu du vol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Lieu du vol *
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder="Ex: Marché central de Douala, Gare routière..."
                className="form-input"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            {/* Circonstances */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Circonstances du vol *
              </label>
              <textarea
                {...register('circumstances')}
                rows={4}
                placeholder="Décrivez comment le vol s'est produit..."
                className="form-textarea"
              />
              {errors.circumstances && (
                <p className="mt-1 text-sm text-red-600">{errors.circumstances.message}</p>
              )}
            </div>

            {/* Numéro de plainte */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de plainte (si déposée)
              </label>
              <input
                type="text"
                {...register('complaintNumber')}
                placeholder="Numéro de référence de la plainte"
                className="form-input"
              />
              <p className="mt-1 text-sm text-gray-500">
                Si vous avez déposé plainte à la police ou gendarmerie
              </p>
            </div>

            {/* Informations additionnelles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations complémentaires
              </label>
              <textarea
                {...register('additionalInfo')}
                rows={3}
                placeholder="Toute information supplémentaire utile..."
                className="form-textarea"
              />
            </div>

            {/* Avertissement */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Important:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Le signalement de vol est irréversible</li>
                    <li>Le téléphone sera bloqué définitivement</li>
                    <li>Une fausse déclaration peut entraîner des poursuites</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Signalement en cours...' : 'Signaler le vol'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportTheftPage;
