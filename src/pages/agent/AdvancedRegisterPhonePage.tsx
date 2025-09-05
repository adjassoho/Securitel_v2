import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  PenTool,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Schéma de validation
const registerPhoneSchema = z.object({
  imei1: z.string().min(15, 'IMEI 1 doit contenir au moins 15 chiffres').max(20, 'IMEI 1 ne peut pas dépasser 20 chiffres'),
  imei2: z.string().min(15, 'IMEI 2 doit contenir au moins 15 chiffres').max(20, 'IMEI 2 ne peut pas dépasser 20 chiffres'),
  imei3: z.string().optional(),
  imei4: z.string().optional(),
  brand: z.string().min(1, 'La marque est obligatoire'),
  model: z.string().min(1, 'Le modèle est obligatoire'),
  ram: z.string().min(1, 'La RAM est obligatoire'),
  storage: z.string().min(1, 'La mémoire interne est obligatoire'),
  serial_number: z.string().min(1, 'Le numéro de série est obligatoire'),
  phone_type: z.enum(['smartphone', 'feature_phone', 'tablet', 'other']),
  other_type: z.string().optional(),
  color: z.string().optional(),
  client_id: z.string().min(1, 'Le client est obligatoire'),
  attestation: z.boolean().refine(val => val === true, 'Vous devez attester que les informations sont vraies'),
});

type RegisterPhoneFormData = z.infer<typeof registerPhoneSchema>;

const AdvancedRegisterPhonePage = () => {
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<{
    imei_proof?: File;
    serial_proof?: File;
    specs_proof?: File;
    signature?: File;
  }>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'moov'>('mtn');
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterPhoneFormData>({
    resolver: zodResolver(registerPhoneSchema),
  });

  const watchedPhoneType = watch('phone_type');

  // Mutation pour enregistrer le téléphone
  const registerPhoneMutation = useMutation({
    mutationFn: async (data: RegisterPhoneFormData) => {
      const formData = new FormData();
      
      // Ajouter les données du formulaire
      Object.keys(data).forEach(key => {
        if (data[key as keyof RegisterPhoneFormData] !== undefined) {
          formData.append(key, String(data[key as keyof RegisterPhoneFormData]));
        }
      });

      // Ajouter les fichiers
      if (uploadedFiles.imei_proof) formData.append('imei_proof', uploadedFiles.imei_proof);
      if (uploadedFiles.serial_proof) formData.append('serial_proof', uploadedFiles.serial_proof);
      if (uploadedFiles.specs_proof) formData.append('specs_proof', uploadedFiles.specs_proof);
      if (uploadedFiles.signature) formData.append('signature', uploadedFiles.signature);

      return agentService.registerClientPhone(data.client_id, formData);
    },
    onSuccess: () => {
      toast.success('Téléphone enregistré avec succès !');
      setStep(1);
      setUploadedFiles({});
      // Reset form
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    },
  });

  const handleFileUpload = (field: keyof typeof uploadedFiles, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const removeFile = (field: keyof typeof uploadedFiles) => {
    setUploadedFiles(prev => ({
      ...prev,
      [field]: undefined
    }));
    if (fileInputRefs.current[field]) {
      fileInputRefs.current[field]!.value = '';
    }
  };

  const onSubmit = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setShowPaymentModal(true);
    }
  };

  const handlePayment = () => {
    // Simuler le paiement
    toast.success('Paiement effectué avec succès !');
    setShowPaymentModal(false);
    registerPhoneMutation.mutate(watch());
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations du Téléphone</h2>
        <p className="text-gray-600">Renseignez les détails techniques du téléphone</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IMEI 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('imei1')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="15-20 chiffres"
          />
          {errors.imei1 && <p className="text-red-500 text-sm mt-1">{errors.imei1.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IMEI 2 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('imei2')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="15-20 chiffres"
          />
          {errors.imei2 && <p className="text-red-500 text-sm mt-1">{errors.imei2.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IMEI 3 (Optionnel)
          </label>
          <input
            type="text"
            {...register('imei3')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="15-20 chiffres"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IMEI 4 (Optionnel)
          </label>
          <input
            type="text"
            {...register('imei4')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="15-20 chiffres"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marque <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('brand')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Samsung, iPhone, etc."
          />
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modèle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('model')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Galaxy S21, iPhone 13, etc."
          />
          {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RAM <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('ram')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="6GB, 8GB, etc."
          />
          {errors.ram && <p className="text-red-500 text-sm mt-1">{errors.ram.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mémoire Interne <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('storage')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="128GB, 256GB, etc."
          />
          {errors.storage && <p className="text-red-500 text-sm mt-1">{errors.storage.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de Série <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('serial_number')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Numéro de série du téléphone"
          />
          {errors.serial_number && <p className="text-red-500 text-sm mt-1">{errors.serial_number.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de Téléphone <span className="text-red-500">*</span>
          </label>
          <select
            {...register('phone_type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner le type</option>
            <option value="smartphone">Smartphone</option>
            <option value="feature_phone">Téléphone à touche</option>
            <option value="tablet">Tablette</option>
            <option value="other">Autre</option>
          </select>
          {errors.phone_type && <p className="text-red-500 text-sm mt-1">{errors.phone_type.message}</p>}
        </div>

        {watchedPhoneType === 'other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Précisez le type
            </label>
            <input
              type="text"
              {...register('other_type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Smartwatch, etc."
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur (Optionnel)
          </label>
          <input
            type="text"
            {...register('color')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Noir, Blanc, Or, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client <span className="text-red-500">*</span>
          </label>
          <select
            {...register('client_id')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner un client</option>
            <option value="client1">Jean Dupont</option>
            <option value="client2">Marie Martin</option>
            {/* TODO: Récupérer la liste des clients */}
          </select>
          {errors.client_id && <p className="text-red-500 text-sm mt-1">{errors.client_id.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Captures et Documents</h2>
        <p className="text-gray-600">Prenez les photos nécessaires pour valider l'enregistrement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capture IMEI */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Capture IMEI <span className="text-red-500">*</span></h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {uploadedFiles.imei_proof ? (
              <div className="space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-sm text-gray-600">{uploadedFiles.imei_proof.name}</p>
                <button
                  onClick={() => removeFile('imei_proof')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Photo de l'IMEI affiché sur l'écran</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={el => fileInputRefs.current.imei_proof = el}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('imei_proof', e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRefs.current.imei_proof?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Prendre une photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Capture Numéro de Série */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Capture Numéro de Série <span className="text-red-500">*</span></h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {uploadedFiles.serial_proof ? (
              <div className="space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-sm text-gray-600">{uploadedFiles.serial_proof.name}</p>
                <button
                  onClick={() => removeFile('serial_proof')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Photo du numéro de série</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={el => fileInputRefs.current.serial_proof = el}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('serial_proof', e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRefs.current.serial_proof?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Prendre une photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Capture RAM/Mémoire */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Capture RAM/Mémoire (Optionnel)</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {uploadedFiles.specs_proof ? (
              <div className="space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-sm text-gray-600">{uploadedFiles.specs_proof.name}</p>
                <button
                  onClick={() => removeFile('specs_proof')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Photo des spécifications</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={el => fileInputRefs.current.specs_proof = el}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('specs_proof', e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRefs.current.specs_proof?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Prendre une photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Signature */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Signature Numérique <span className="text-red-500">*</span></h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {uploadedFiles.signature ? (
              <div className="space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <p className="text-sm text-gray-600">{uploadedFiles.signature.name}</p>
                <button
                  onClick={() => removeFile('signature')}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Signature du client</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={el => fileInputRefs.current.signature = el}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('signature', e.target.files[0])}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRefs.current.signature?.click()}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Ajouter signature
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Attestation et Paiement</h2>
        <p className="text-gray-600">Confirmez les informations et effectuez le paiement</p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>IMEI 1:</strong> {watch('imei1')}</p>
            <p><strong>IMEI 2:</strong> {watch('imei2')}</p>
            <p><strong>Marque:</strong> {watch('brand')}</p>
            <p><strong>Modèle:</strong> {watch('model')}</p>
          </div>
          <div>
            <p><strong>RAM:</strong> {watch('ram')}</p>
            <p><strong>Stockage:</strong> {watch('storage')}</p>
            <p><strong>Type:</strong> {watch('phone_type')}</p>
            <p><strong>Couleur:</strong> {watch('color') || 'Non spécifiée'}</p>
          </div>
        </div>
      </div>

      {/* Attestation */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('attestation')}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <label className="text-sm font-medium text-gray-700">
              J'atteste que les informations saisies sont vraies et exactes
            </label>
            <p className="text-xs text-gray-500 mt-1">
              En cochant cette case, je confirme que toutes les informations fournies sont correctes et que j'ai vérifié l'authenticité des documents.
            </p>
          </div>
        </div>
        {errors.attestation && <p className="text-red-500 text-sm">{errors.attestation.message}</p>}
      </div>

      {/* Paiement */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Frais d'enregistrement</h3>
            <p className="text-sm text-gray-600">Paiement obligatoire pour valider l'enregistrement</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">1 500 FCFA</p>
            <p className="text-sm text-gray-500">TTC</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Enregistrement de Téléphone</h1>
        <p className="mt-2 text-gray-600">
          Formulaire complet avec captures et signature numérique
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>

      {/* Steps */}
      <div className="flex justify-center space-x-8 mb-8">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="text-sm font-medium">Informations</span>
        </div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="text-sm font-medium">Captures</span>
        </div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="text-sm font-medium">Paiement</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          <button
            type="submit"
            disabled={registerPhoneMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {step === 3 ? 'Finaliser' : 'Suivant'}
          </button>
        </div>
      </form>

      {/* Modal de paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Paiement de 1 500 FCFA
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="mtn"
                      checked={paymentMethod === 'mtn'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'mtn')}
                      className="text-blue-600"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 font-bold text-sm">M</span>
                      </div>
                      <span>MTN Mobile Money</span>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value="moov"
                      checked={paymentMethod === 'moov'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'moov')}
                      className="text-blue-600"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">M</span>
                      </div>
                      <span>Moov Money</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Payer maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedRegisterPhonePage;
