import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { phoneService } from '../../services/api';

const reportLossSchema = z.object({
  phoneId: z.string().min(1, 'Veuillez sélectionner un téléphone'),
  lossDate: z.string().min(1, 'La date de perte est requise'),
  lossTime: z.string().optional(),
  lastKnownLocation: z.string().min(10, 'Veuillez fournir une description détaillée du dernier lieu connu'),
  lossCircumstances: z.string().min(20, 'Veuillez décrire les circonstances de la perte (minimum 20 caractères)'),
  additionalInfo: z.string().optional(),
});

type ReportLossData = z.infer<typeof reportLossSchema>;

const ReportLossPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPhones] = useState([
    { id: '1', brand: 'Apple', model: 'iPhone 13', imei: '123456789012345' },
    { id: '2', brand: 'Samsung', model: 'Galaxy S22', imei: '987654321098765' },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReportLossData>({
    resolver: zodResolver(reportLossSchema),
  });

  const onSubmit = async (data: ReportLossData) => {
    setIsSubmitting(true);
    try {
      await phoneService.reportLoss(data.phoneId, {
        lossDate: data.lossDate,
        lossTime: data.lossTime,
        lastKnownLocation: data.lastKnownLocation,
        lossCircumstances: data.lossCircumstances,
        additionalInfo: data.additionalInfo,
      });
      toast.success('Signalement de perte enregistré avec succès');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur lors du signalement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-orange-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Signaler une perte</h1>
            <p className="text-orange-100 mt-1">
              Déclarez la perte de votre téléphone pour activer la protection
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Sélection du téléphone */}
            <div>
              <label htmlFor="phoneId" className="block text-sm font-medium text-gray-700">
                Téléphone perdu
              </label>
              <select
                id="phoneId"
                {...register('phoneId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un téléphone</option>
                {userPhones.map((phone) => (
                  <option key={phone.id} value={phone.id}>
                    {phone.brand} {phone.model} - IMEI: {phone.imei}
                  </option>
                ))}
              </select>
              {errors.phoneId && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneId.message}</p>
              )}
            </div>

            {/* Date et heure de perte */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="lossDate" className="block text-sm font-medium text-gray-700">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date de perte
                </label>
                <input
                  type="date"
                  id="lossDate"
                  {...register('lossDate')}
                  max={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.lossDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.lossDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lossTime" className="block text-sm font-medium text-gray-700">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Heure approximative (optionnel)
                </label>
                <input
                  type="time"
                  id="lossTime"
                  {...register('lossTime')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Dernier lieu connu */}
            <div>
              <label htmlFor="lastKnownLocation" className="block text-sm font-medium text-gray-700">
                <MapPin className="inline h-4 w-4 mr-1" />
                Dernier lieu connu
              </label>
              <textarea
                id="lastKnownLocation"
                rows={3}
                {...register('lastKnownLocation')}
                placeholder="Décrivez le dernier endroit où vous avez vu votre téléphone (adresse, lieu, quartier...)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.lastKnownLocation && (
                <p className="mt-1 text-sm text-red-600">{errors.lastKnownLocation.message}</p>
              )}
            </div>

            {/* Circonstances de la perte */}
            <div>
              <label htmlFor="lossCircumstances" className="block text-sm font-medium text-gray-700">
                Circonstances de la perte
              </label>
              <textarea
                id="lossCircumstances"
                rows={4}
                {...register('lossCircumstances')}
                placeholder="Décrivez comment vous avez perdu votre téléphone (oubli dans un transport, chute, etc.)"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.lossCircumstances && (
                <p className="mt-1 text-sm text-red-600">{errors.lossCircumstances.message}</p>
              )}
            </div>

            {/* Informations supplémentaires */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                Informations supplémentaires (optionnel)
              </label>
              <textarea
                id="additionalInfo"
                rows={3}
                {...register('additionalInfo')}
                placeholder="Ajoutez toute information qui pourrait aider à retrouver votre téléphone"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Message d'avertissement */}
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Une fois signalé comme perdu, votre téléphone sera marqué dans notre base de données</li>
                      <li>Toute tentative de vente sera bloquée et signalée</li>
                      <li>Vous pouvez annuler ce signalement si vous retrouvez votre téléphone</li>
                      <li>Pensez à contacter votre opérateur pour bloquer la ligne SIM</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signalement en cours...' : 'Signaler la perte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLossPage;
