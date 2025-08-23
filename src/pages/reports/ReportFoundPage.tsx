import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { Search, MapPin, Calendar, Phone, CheckCircle, XCircle, Smartphone, Hash, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/api';

type VerificationType = 'imei' | 'serial';

const foundReportSchema = z.object({
  verificationType: z.enum(['imei', 'serial']),
  identifierValue: z.string().min(1, 'Cette information est requise'),
  foundDate: z.string().min(1, 'La date de découverte est requise'),
  foundLocation: z.string().min(10, 'Veuillez décrire le lieu de découverte (minimum 10 caractères)').max(500),
  reporterPhone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres').regex(/^[+0-9\s()-]+$/, 'Format de téléphone invalide'),
});

type FoundReportData = z.infer<typeof foundReportSchema>;

const ReportFoundPage = () => {
  const [verificationType, setVerificationType] = useState<VerificationType>('imei');
  const [identifierValue, setIdentifierValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FoundReportData>({
    resolver: zodResolver(foundReportSchema),
    defaultValues: {
      verificationType: 'imei'
    }
  });

  // Validation stricte selon le type
  const validateIdentifier = (value: string, type: VerificationType) => {
    if (type === 'imei') {
      const cleanValue = value.replace(/\D/g, '');
      return cleanValue.length === 15 && /^[0-9]{15}$/.test(cleanValue);
    } else {
      return value.trim().length >= 8 && value.trim().length <= 20 && /^[A-Za-z0-9]+$/.test(value.trim());
    }
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (verificationType === 'imei') {
      const cleanValue = value.replace(/\D/g, '');
      if (cleanValue.length <= 15) {
        setIdentifierValue(cleanValue);
        setValue('identifierValue', cleanValue);
        setIsValid(validateIdentifier(cleanValue, verificationType));
      }
    } else {
      const cleanValue = value.replace(/[^A-Za-z0-9]/g, '');
      if (cleanValue.length <= 20) {
        const upperValue = cleanValue.toUpperCase();
        setIdentifierValue(upperValue);
        setValue('identifierValue', upperValue);
        setIsValid(validateIdentifier(upperValue, verificationType));
      }
    }
  };

  const handleTypeChange = (type: VerificationType) => {
    setVerificationType(type);
    setIdentifierValue('');
    setIsValid(false);
    setValue('verificationType', type);
    setValue('identifierValue', '');
  };

  const onSubmit = async (data: FoundReportData) => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      await reportService.reportFound({
        serial_number: data.verificationType === 'serial' ? data.identifierValue : '',
        imei: data.verificationType === 'imei' ? data.identifierValue : '',
        found_date: data.foundDate,
        found_location: data.foundLocation,
        reporter_phone: data.reporterPhone,
      });
      setNotification({ type: 'success', message: 'Signalement envoyé avec succès !' });
      reset();
      setIdentifierValue('');
      setIsValid(false);
    } catch (error) {
      setNotification({ type: 'error', message: 'Erreur lors de l\'envoi du signalement.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
      
      <div className="relative min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link 
              to="/verify" 
              className="inline-flex items-center text-emerald-200 hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour à la vérification
            </Link>
          </div>

          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 mx-auto w-20 h-20 flex items-center justify-center">
                <img src="/images/logo.png" alt="SecuriTel Logo" className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Déclarer un téléphone trouvé
            </h1>
            <p className="text-lg lg:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Aidez à réunir un téléphone perdu avec son propriétaire légitime
            </p>
          </div>

          {/* Notification */}
          {notification && (
            <div className={`mb-8 p-6 rounded-2xl backdrop-blur-lg border ${
              notification.type === 'success'
                ? 'bg-green-500/20 border-green-500/30 text-green-100'
                : 'bg-red-500/20 border-red-500/30 text-red-100'
            } shadow-xl`}>
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                )}
                <p className="font-medium">{notification.message}</p>
              </div>
            </div>
          )}

          {/* Formulaire principal */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-white/20 shadow-2xl mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Sélecteur de type d'identification */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-4">
                  Type d'identification du téléphone
                </label>
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/10">
                  <button
                    type="button"
                    onClick={() => handleTypeChange('imei')}
                    className={`
                      flex-1 flex items-center justify-center px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300
                      ${
                        verificationType === 'imei'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    IMEI
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTypeChange('serial')}
                    className={`
                      flex-1 flex items-center justify-center px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-300
                      ${
                        verificationType === 'serial'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Hash className="w-5 h-5 mr-2" />
                    Numéro de série
                  </button>
                </div>
              </div>

              {/* Champ d'identification */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/90 flex items-center">
                  {verificationType === 'imei' ? (
                    <>
                      <Smartphone className="w-5 h-5 mr-2 text-emerald-300" />
                      Numéro IMEI du téléphone trouvé
                    </>
                  ) : (
                    <>
                      <Hash className="w-5 h-5 mr-2 text-emerald-300" />
                      Numéro de série du téléphone trouvé
                    </>
                  )}
                  <span className="text-red-400 ml-1">*</span>
                </label>
                
                <div className="relative">
                  <input
                    type="text"
                    value={identifierValue}
                    onChange={handleIdentifierChange}
                    className={`
                      w-full px-16 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15 font-mono text-lg tracking-widest text-center
                      ${
                        identifierValue.length > 0
                          ? isValid
                            ? 'border-emerald-400 ring-4 ring-emerald-400/20'
                            : 'border-red-400 ring-4 ring-red-400/20'
                          : ''
                      }
                    `}
                    placeholder={
                      verificationType === 'imei'
                        ? "Entrez les 15 chiffres de l'IMEI"
                        : "Entrez le numéro de série"
                    }
                    maxLength={verificationType === 'imei' ? 15 : 20}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-white/60" />
                  </div>
                  
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    {identifierValue.length > 0 && (
                      <>
                        {isValid ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {errors.identifierValue && (
                  <p className="text-sm text-red-300 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    {errors.identifierValue.message}
                  </p>
                )}
              </div>

              {/* Date de découverte */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/90 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-emerald-300" />
                  Date de découverte
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="date"
                  {...register('foundDate')}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                />
                {errors.foundDate && (
                  <p className="text-sm text-red-300 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    {errors.foundDate.message}
                  </p>
                )}
              </div>

              {/* Lieu de découverte */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/90 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-emerald-300" />
                  Lieu de découverte
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <textarea
                  {...register('foundLocation')}
                  rows={4}
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15 resize-none"
                  placeholder="Décrivez précisément où vous avez trouvé le téléphone (adresse, nom du lieu, points de repère, etc.)"
                />
                {errors.foundLocation && (
                  <p className="text-sm text-red-300 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    {errors.foundLocation.message}
                  </p>
                )}
              </div>

              {/* Numéro de téléphone */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-white/90 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-emerald-300" />
                  Votre numéro de téléphone
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  {...register('reporterPhone')}
                  className="w-full px-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                  placeholder="Ex: +229 12 34 56 78 ou 0612345678"
                />
                {errors.reporterPhone && (
                  <p className="text-sm text-red-300 flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    {errors.reporterPhone.message}
                  </p>
                )}
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Envoyer le signalement</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFoundPage;