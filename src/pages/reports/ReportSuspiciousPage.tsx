import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../../services/api';
import { toast } from 'react-hot-toast';

const reportSuspiciousSchema = z.object({
  phoneNumber: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres'),
  imei: z.string().min(15, 'L\'IMEI doit contenir 15 chiffres').max(15, 'L\'IMEI doit contenir 15 chiffres').optional(),
  suspicionType: z.enum(['stolen', 'counterfeit', 'fraud', 'other'] as const).describe('Veuillez sélectionner le type de suspicion'),
  suspicionDetails: z.string().min(20, 'Veuillez fournir plus de détails (minimum 20 caractères)'),
  contactInfo: z.string().optional(),
  hasEvidence: z.boolean(),
  evidenceDescription: z.string().optional(),
});

type ReportSuspiciousFormData = z.infer<typeof reportSuspiciousSchema>;

const ReportSuspiciousPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportSuspiciousFormData>({
    resolver: zodResolver(reportSuspiciousSchema),
    defaultValues: {
      hasEvidence: false,
    },
  });

  const hasEvidence = watch('hasEvidence');

  const onSubmit = async (data: ReportSuspiciousFormData) => {
    setIsSubmitting(true);
    try {
      await reportService.reportSuspicious({
        reporter_phone: data.contactInfo || '',
        holder_phone: data.phoneNumber,
      });
      
      toast.success('Signalement envoyé avec succès. Nous allons examiner votre déclaration.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error reporting suspicious phone:', error);
      toast.error('Erreur lors de l\'envoi du signalement. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour au tableau de bord
        </button>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Signaler un téléphone suspect</h1>
          </div>

          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Important :</strong> Utilisez ce formulaire pour signaler un téléphone que vous 
              suspectez d'être volé, contrefait ou utilisé de manière frauduleuse. Les fausses 
              déclarations peuvent entraîner des poursuites judiciaires.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-1" />
                Numéro de téléphone suspect
              </label>
              <input
                type="tel"
                {...register('phoneNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 0612345678"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IMEI (optionnel)
              </label>
              <input
                type="text"
                {...register('imei')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="15 chiffres"
              />
              {errors.imei && (
                <p className="mt-1 text-sm text-red-600">{errors.imei.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Si vous connaissez l'IMEI du téléphone suspect</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de suspicion
              </label>
              <select
                {...register('suspicionType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez le type de suspicion</option>
                <option value="stolen">Téléphone volé</option>
                <option value="counterfeit">Téléphone contrefait</option>
                <option value="fraud">Utilisation frauduleuse</option>
                <option value="other">Autre</option>
              </select>
              {errors.suspicionType && (
                <p className="mt-1 text-sm text-red-600">{errors.suspicionType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Détails de la suspicion
              </label>
              <textarea
                {...register('suspicionDetails')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez pourquoi vous suspectez ce téléphone..."
              />
              {errors.suspicionDetails && (
                <p className="mt-1 text-sm text-red-600">{errors.suspicionDetails.message}</p>
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('hasEvidence')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  J'ai des preuves ou des documents à l'appui
                </span>
              </label>
            </div>

            {hasEvidence && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description des preuves
                </label>
                <textarea
                  {...register('evidenceDescription')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Décrivez les preuves que vous possédez..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vos coordonnées (optionnel)
              </label>
              <input
                type="text"
                {...register('contactInfo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email ou téléphone pour vous contacter si nécessaire"
              />
              <p className="mt-1 text-xs text-gray-500">
                Nous pourrions avoir besoin de vous contacter pour plus d'informations
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportSuspiciousPage;
