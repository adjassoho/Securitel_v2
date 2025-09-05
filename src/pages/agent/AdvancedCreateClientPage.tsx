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
  FileText,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  UserPlus,
  CameraIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Schéma de validation
const createClientSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  address: z.string().min(5, 'L\'adresse doit contenir au moins 5 caractères'),
  city: z.string().min(2, 'La ville est obligatoire'),
  whatsapp: z.string().optional(),
  id_type: z.enum(['cni', 'passport', 'voter_card']),
  id_number: z.string().min(5, 'Le numéro de pièce d\'identité est obligatoire'),
  id_issuer: z.string().min(2, 'L\'autorité émettrice est obligatoire'),
  id_issue_date: z.string().min(1, 'La date d\'émission est obligatoire'),
  id_expiry_date: z.string().min(1, 'La date d\'expiration est obligatoire'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirm_password: z.string(),
  terms_accepted: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
  privacy_accepted: z.boolean().refine(val => val === true, 'Vous devez accepter la politique de confidentialité'),
}).refine((data) => data.password === data.confirm_password, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirm_password"],
});

type CreateClientFormData = z.infer<typeof createClientSchema>;

const AdvancedCreateClientPage = () => {
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<{
    profile_photo?: File;
    id_front?: File;
    id_back?: File;
    id_selfie?: File;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
  });

  // Mutation pour créer le client
  const createClientMutation = useMutation({
    mutationFn: async (data: CreateClientFormData) => {
      const formData = new FormData();
      
      // Ajouter les données du formulaire
      Object.keys(data).forEach(key => {
        if (data[key as keyof CreateClientFormData] !== undefined && key !== 'confirm_password') {
          formData.append(key, String(data[key as keyof CreateClientFormData]));
        }
      });

      // Ajouter les fichiers
      if (uploadedFiles.profile_photo) formData.append('profile_photo', uploadedFiles.profile_photo);
      if (uploadedFiles.id_front) formData.append('id_front', uploadedFiles.id_front);
      if (uploadedFiles.id_back) formData.append('id_back', uploadedFiles.id_back);
      if (uploadedFiles.id_selfie) formData.append('id_selfie', uploadedFiles.id_selfie);

      return agentService.createClient(formData);
    },
    onSuccess: () => {
      toast.success('Client créé avec succès !');
      setStep(1);
      setUploadedFiles({});
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du client');
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

  const onSubmit = (data: CreateClientFormData) => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      createClientMutation.mutate(data);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations Personnelles</h2>
        <p className="text-gray-600">Renseignez les informations de base du client</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('first_name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Prénom du client"
          />
          {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('last_name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nom du client"
          />
          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="email@exemple.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+225 XX XX XX XX XX"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp (Optionnel)
          </label>
          <input
            type="tel"
            {...register('whatsapp')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+225 XX XX XX XX XX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('city')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Abidjan, Bouaké, etc."
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('address')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Adresse complète du client"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pièce d'Identité</h2>
        <p className="text-gray-600">Renseignez les informations de la pièce d'identité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de Pièce <span className="text-red-500">*</span>
          </label>
          <select
            {...register('id_type')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner le type</option>
            <option value="cni">Carte Nationale d'Identité</option>
            <option value="passport">Passeport</option>
            <option value="voter_card">Carte d'Électeur</option>
          </select>
          {errors.id_type && <p className="text-red-500 text-sm mt-1">{errors.id_type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de Pièce <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('id_number')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Numéro de la pièce d'identité"
          />
          {errors.id_number && <p className="text-red-500 text-sm mt-1">{errors.id_number.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Autorité Émettrice <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('id_issuer')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Ministère de l'Intérieur"
          />
          {errors.id_issuer && <p className="text-red-500 text-sm mt-1">{errors.id_issuer.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'Émission <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('id_issue_date')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.id_issue_date && <p className="text-red-500 text-sm mt-1">{errors.id_issue_date.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date d'Expiration <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register('id_expiry_date')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.id_expiry_date && <p className="text-red-500 text-sm mt-1">{errors.id_expiry_date.message}</p>}
        </div>
      </div>

      {/* Upload des documents */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Documents à Fournir</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo de profil */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Photo de Profil <span className="text-red-500">*</span></h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedFiles.profile_photo ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-sm text-gray-600">{uploadedFiles.profile_photo.name}</p>
                  <button
                    onClick={() => removeFile('profile_photo')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Photo du client</p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => fileInputRefs.current.profile_photo = el}
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('profile_photo', e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRefs.current.profile_photo?.click()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Prendre une photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recto de la pièce */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Recto de la Pièce <span className="text-red-500">*</span></h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedFiles.id_front ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-sm text-gray-600">{uploadedFiles.id_front.name}</p>
                  <button
                    onClick={() => removeFile('id_front')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Recto de la pièce d'identité</p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => fileInputRefs.current.id_front = el}
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('id_front', e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRefs.current.id_front?.click()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Prendre une photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Verso de la pièce */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Verso de la Pièce <span className="text-red-500">*</span></h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedFiles.id_back ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-sm text-gray-600">{uploadedFiles.id_back.name}</p>
                  <button
                    onClick={() => removeFile('id_back')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Verso de la pièce d'identité</p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => fileInputRefs.current.id_back = el}
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('id_back', e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRefs.current.id_back?.click()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Prendre une photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Selfie avec la pièce */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Selfie avec la Pièce <span className="text-red-500">*</span></h4>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedFiles.id_selfie ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-sm text-gray-600">{uploadedFiles.id_selfie.name}</p>
                  <button
                    onClick={() => removeFile('id_selfie')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <CameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Selfie tenant la pièce d'identité</p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={el => fileInputRefs.current.id_selfie = el}
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('id_selfie', e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRefs.current.id_selfie?.click()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Prendre une photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sécurité et Conditions</h2>
        <p className="text-gray-600">Définissez le mot de passe et acceptez les conditions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mot de Passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mot de passe sécurisé"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmer le Mot de Passe <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirm_password')}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirmer le mot de passe"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
          {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>}
        </div>
      </div>

      {/* Récapitulatif */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif du Client</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Nom:</strong> {watch('first_name')} {watch('last_name')}</p>
            <p><strong>Email:</strong> {watch('email')}</p>
            <p><strong>Téléphone:</strong> {watch('phone')}</p>
            <p><strong>Ville:</strong> {watch('city')}</p>
          </div>
          <div>
            <p><strong>Pièce d'identité:</strong> {watch('id_type')}</p>
            <p><strong>Numéro:</strong> {watch('id_number')}</p>
            <p><strong>Émise le:</strong> {watch('id_issue_date')}</p>
            <p><strong>Expire le:</strong> {watch('id_expiry_date')}</p>
          </div>
        </div>
      </div>

      {/* Conditions */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('terms_accepted')}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <label className="text-sm font-medium text-gray-700">
              J'accepte les <a href="/terms" className="text-blue-600 hover:underline">Conditions Générales d'Utilisation</a>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              En cochant cette case, le client accepte les conditions d'utilisation de SecuriTels.
            </p>
          </div>
        </div>
        {errors.terms_accepted && <p className="text-red-500 text-sm">{errors.terms_accepted.message}</p>}

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            {...register('privacy_accepted')}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <label className="text-sm font-medium text-gray-700">
              J'accepte la <a href="/privacy" className="text-blue-600 hover:underline">Politique de Confidentialité</a>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Le client accepte que ses données personnelles soient traitées conformément à notre politique.
            </p>
          </div>
        </div>
        {errors.privacy_accepted && <p className="text-red-500 text-sm">{errors.privacy_accepted.message}</p>}
      </div>

      {/* Informations importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Informations Importantes</h4>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• Le client sera automatiquement rattaché à votre compte d'agent</li>
              <li>• Vous recevrez des commissions sur ses enregistrements</li>
              <li>• Le compte sera activé après vérification des documents</li>
              <li>• Un email de confirmation sera envoyé au client</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Création de Compte Client</h1>
        <p className="mt-2 text-gray-600">
          Formulaire complet avec vérification d'identité et documents
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
          <span className="text-sm font-medium">Documents</span>
        </div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span className="text-sm font-medium">Sécurité</span>
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
            disabled={createClientMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {createClientMutation.isPending ? (
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </div>
            ) : step === 3 ? (
              <div className="flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Créer le Client
              </div>
            ) : (
              'Suivant'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedCreateClientPage;
