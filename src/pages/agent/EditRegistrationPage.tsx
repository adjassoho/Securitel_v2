import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { agentService } from '@/services/api';
import {
  Edit3,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Camera,
  Upload,
  RefreshCw,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Schéma de validation pour la modification
const editRegistrationSchema = z.object({
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
  justification: z.string().min(10, 'La justification doit contenir au moins 10 caractères'),
});

type EditRegistrationFormData = z.infer<typeof editRegistrationSchema>;

const EditRegistrationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<{
    imei_proof?: File;
    serial_proof?: File;
    specs_proof?: File;
    signature?: File;
  }>({});
  const [showJustificationModal, setShowJustificationModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EditRegistrationFormData>({
    resolver: zodResolver(editRegistrationSchema),
  });

  const watchedPhoneType = watch('phone_type');

  // Récupération des détails de l'enregistrement
  const { data: registration, isLoading, error } = useQuery({
    queryKey: ['agent-registration', id],
    queryFn: () => agentService.getRegistrationById(id!),
    enabled: !!id,
  });

  // Mutation pour modifier l'enregistrement
  const updateRegistrationMutation = useMutation({
    mutationFn: async (data: EditRegistrationFormData) => {
      const formData = new FormData();
      
      // Ajouter les données du formulaire
      Object.keys(data).forEach(key => {
        if (data[key as keyof EditRegistrationFormData] !== undefined) {
          formData.append(key, String(data[key as keyof EditRegistrationFormData]));
        }
      });

      // Ajouter les fichiers
      if (uploadedFiles.imei_proof) formData.append('imei_proof', uploadedFiles.imei_proof);
      if (uploadedFiles.serial_proof) formData.append('serial_proof', uploadedFiles.serial_proof);
      if (uploadedFiles.specs_proof) formData.append('specs_proof', uploadedFiles.specs_proof);
      if (uploadedFiles.signature) formData.append('signature', uploadedFiles.signature);

      return agentService.updateRegistrationById(id!, formData);
    },
    onSuccess: () => {
      toast.success('Enregistrement modifié avec succès !');
      navigate('/agent/registrations');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    },
  });

  // Chargement des données existantes
  useEffect(() => {
    if (registration) {
      setValue('imei1', registration.imei1 || '');
      setValue('imei2', registration.imei2 || '');
      setValue('imei3', registration.imei3 || '');
      setValue('imei4', registration.imei4 || '');
      setValue('brand', registration.brand || '');
      setValue('model', registration.model || '');
      setValue('ram', registration.ram || '');
      setValue('storage', registration.storage || '');
      setValue('serial_number', registration.serial_number || '');
      setValue('phone_type', registration.phone_type || 'smartphone');
      setValue('other_type', registration.other_type || '');
      setValue('color', registration.color || '');
    }
  }, [registration, setValue]);

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
  };

  const onSubmit = () => {
    setShowJustificationModal(true);
  };

  const handleConfirmEdit = (justification: string) => {
    const formData = { ...watch(), justification };
    updateRegistrationMutation.mutate(formData);
    setShowJustificationModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Enregistrement non trouvé</h3>
        <p className="text-gray-500 mb-4">L'enregistrement demandé n'existe pas ou n'est pas accessible</p>
        <button
          onClick={() => navigate('/agent/registrations')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux enregistrements
        </button>
      </div>
    );
  }

  if (registration.status !== 'pending') {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Modification non autorisée</h3>
        <p className="text-gray-500 mb-4">
          Seuls les enregistrements en attente peuvent être modifiés. 
          Le statut actuel est : <span className="font-semibold">{registration.status}</span>
        </p>
        <button
          onClick={() => navigate('/agent/registrations')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux enregistrements
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'Enregistrement</h1>
          <p className="mt-2 text-gray-600">
            Modifiez les informations de l'enregistrement en attente
          </p>
        </div>
        <button
          onClick={() => navigate('/agent/registrations')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </button>
      </div>

      {/* Informations actuelles */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-900">Enregistrement en attente</span>
        </div>
        <p className="text-sm text-blue-800">
          Créé le {new Date(registration.created_at).toLocaleDateString('fr-FR')} à {new Date(registration.created_at).toLocaleTimeString('fr-FR')}
        </p>
      </div>

      {/* Formulaire de modification */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations du Téléphone</h2>

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
          </div>
        </div>

        {/* Documents (optionnels pour modification) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents (Optionnels)</h2>
          <p className="text-sm text-gray-600 mb-6">
            Vous pouvez remplacer les documents existants en uploadant de nouveaux fichiers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Capture IMEI */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Capture IMEI</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadedFiles.imei_proof ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <p className="text-sm text-gray-600">{uploadedFiles.imei_proof.name}</p>
                    <button
                      type="button"
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
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('imei_proof', e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Remplacer
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Capture Numéro de Série */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Capture Numéro de Série</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadedFiles.serial_proof ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <p className="text-sm text-gray-600">{uploadedFiles.serial_proof.name}</p>
                    <button
                      type="button"
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
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('serial_proof', e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Remplacer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/agent/registrations')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={updateRegistrationMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {updateRegistrationMutation.isPending ? (
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Modification...
              </div>
            ) : (
              <div className="flex items-center">
                <Edit3 className="h-4 w-4 mr-2" />
                Modifier l'Enregistrement
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Modal de justification */}
      {showJustificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Justification de la Modification
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Expliquez pourquoi vous modifiez cet enregistrement..."
                  onChange={(e) => setValue('justification', e.target.value)}
                />
                {errors.justification && (
                  <p className="text-red-500 text-sm mt-1">{errors.justification.message}</p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Important</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Toute modification sera soumise à une nouvelle vérification par l'administration.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJustificationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleConfirmEdit(watch('justification'))}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirmer la Modification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditRegistrationPage;
