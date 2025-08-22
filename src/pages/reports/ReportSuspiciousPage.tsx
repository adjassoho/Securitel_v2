import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Phone, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../../services/api';
import { toast } from 'react-hot-toast';
import IMEIInput from '@/components/ui/IMEIInput';

const reportSuspiciousSchema = z.object({
  phoneNumber: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres'),
  imei: z.string().regex(/^[0-9]{15}$/, 'IMEI doit contenir exactement 15 chiffres').optional().or(z.literal('')),
  suspicionType: z.string().min(1, 'Veuillez sélectionner le type de suspicion'),
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
    <div className="form-container min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </button>
        </div>

        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Signaler un téléphone suspect
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aidez à protéger la communauté en signalant un téléphone suspect
          </p>
        </div>

        <div className="form-section">
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Informations de signalement</h2>
          </div>

          <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Important à retenir</h3>
                <p className="text-sm text-orange-700 leading-relaxed">
                  Utilisez ce formulaire pour signaler un téléphone que vous 
                  suspectez d'être volé, contrefait ou utilisé de manière frauduleuse. 
                  <strong className="text-orange-800"> Les fausses déclarations peuvent entraîner des poursuites judiciaires.</strong>
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="form-grid">
              <div className="form-field">
                <label className="enhanced-label">
                  <Phone className="w-5 h-5 mr-2 text-orange-600" />
                  Numéro de téléphone suspect
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className={`enhanced-input ${
                    errors.phoneNumber ? 'error-input' : ''
                  }`}
                  placeholder="Ex: +229 XX XX XX XX"
                />
                {errors.phoneNumber && (
                  <p className="field-error">{errors.phoneNumber.message}</p>
                )}
                <p className="field-help">
                  Numéro du téléphone que vous souhaitez signaler
                </p>
              </div>

              <div className="form-field md:col-span-2">
                <IMEIInput
                  label="IMEI (optionnel)"
                  placeholder="15 chiffres uniquement"
                  register={register('imei')}
                  error={errors.imei?.message}
                  className="w-full"
                />
                <p className="field-help mt-2">
                  Si vous connaissez l'IMEI du téléphone suspect, cela nous aidera dans l'enquête
                </p>
              </div>
            </div>

            <div className="form-field">
              <label className="enhanced-label">
                Type de suspicion
                <span className="text-red-500 ml-1">*</span>
              </label>
              <select
                {...register('suspicionType')}
                className={`enhanced-select ${
                  errors.suspicionType ? 'error-input' : ''
                }`}
              >
                <option value="">Sélectionnez le type de suspicion</option>
                <option value="stolen">📱 Téléphone volé</option>
                <option value="counterfeit">🚫 Téléphone contrefait</option>
                <option value="fraud">⚠️ Utilisation frauduleuse</option>
                <option value="other">❓ Autre raison</option>
              </select>
              {errors.suspicionType && (
                <p className="field-error">{errors.suspicionType.message}</p>
              )}
              <p className="field-help">
                Précisez le type de problème que vous suspectez
              </p>
            </div>

            <div className="form-field md:col-span-2">
              <label className="enhanced-label">
                Détails de la suspicion
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                {...register('suspicionDetails')}
                rows={6}
                className={`enhanced-textarea ${
                  errors.suspicionDetails ? 'error-input' : ''
                }`}
                placeholder="Décrivez en détail pourquoi vous suspectez ce téléphone. Plus vous donnez d'informations, plus nous pourrons agir efficacement..."
              />
              {errors.suspicionDetails && (
                <p className="field-error">{errors.suspicionDetails.message}</p>
              )}
              <p className="field-help">
                Minimum 20 caractères. Incluez des détails comme : où vous avez vu le téléphone, comportement suspect, etc.
              </p>
            </div>

            <div className="form-field md:col-span-2">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('hasEvidence')}
                    className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">
                      J'ai des preuves ou des documents à l'appui
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Cochez cette case si vous possédez des photos, documents ou autres preuves
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {hasEvidence && (
              <div className="form-field md:col-span-2 animate-fadeIn">
                <label className="enhanced-label">
                  Description des preuves
                </label>
                <textarea
                  {...register('evidenceDescription')}
                  rows={4}
                  className="enhanced-textarea"
                  placeholder="Décrivez les preuves que vous possédez : captures d'écran, photos, documents, témoignages, etc."
                />
                <p className="field-help">
                  Nous pourrions vous contacter pour obtenir ces preuves si nécessaire
                </p>
              </div>
            )}

            <div className="form-field md:col-span-2">
              <label className="enhanced-label">
                Vos coordonnées (optionnel)
              </label>
              <input
                type="text"
                {...register('contactInfo')}
                className="enhanced-input"
                placeholder="Email ou téléphone pour vous contacter si nécessaire"
              />
              <p className="field-help">
                💡 Nous pourrions avoir besoin de vous contacter pour plus d'informations ou pour le suivi de votre signalement
              </p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-form-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-form-primary bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    Envoyer le signalement
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportSuspiciousPage;
