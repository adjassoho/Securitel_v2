import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { phoneService, paymentService } from '@/services/api';
import toast from 'react-hot-toast';
import { Upload, Check, AlertCircle, X, FileImage, ChevronRight, ChevronLeft, Smartphone } from 'lucide-react';
import type { RegisterPhoneRequest } from '@/types';
import IMEIInput from '@/components/ui/IMEIInput';
import { useIAValidation } from '@/hooks/useIAValidation';
import IAValidationIndicator from '@/components/ui/IAValidationIndicator';

interface FormData {
  imei1: string;
  imei2: string;
  brand: string;
  model: string;
  ram: string;
  storage: string;
  serial_number: string;
  imei_proof: FileList;
  serial_proof: FileList;
  specs_proof: FileList;
  accept_terms: boolean;
}

interface UploadedFile {
  file: File;
  preview: string;
}

// Ajout de l'interface pour les résultats de validation IA
interface IAValidationResult {
  isValid: boolean;
  errors: string[];
  extractedData: any;
}

const RegisterPhonePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    imei_proof?: UploadedFile;
    serial_proof?: UploadedFile;
    specs_proof?: UploadedFile;
  }>({});
  
  // États pour la validation IA
  const [iaValidations, setIaValidations] = useState<Record<string, IAValidationResult>>({});
  const [isIaValidating, setIsIaValidating] = useState<Record<string, boolean>>({
    imei_proof: false,
    serial_proof: false,
    specs_proof: false
  });
  
  // Utilisation du hook de validation IA
  const { validateImage } = useIAValidation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue
  } = useForm<FormData>();

  // Surveiller les valeurs pour la validation des étapes
  const watchedValues = watch();

  // Validation de l'étape 1
  const isStep1Valid = () => {
    return (
      watchedValues.imei1?.length === 15 &&
      watchedValues.imei2?.length === 15 &&
      watchedValues.brand &&
      watchedValues.model &&
      watchedValues.ram &&
      watchedValues.storage &&
      watchedValues.serial_number
    );
  };

  // Validation de l'étape 2 avec vérification IA
  const isStep2Valid = () => {
    return (
      uploadedFiles.imei_proof &&
      uploadedFiles.serial_proof &&
      uploadedFiles.specs_proof &&
      iaValidations.imei_proof?.isValid !== false &&
      iaValidations.serial_proof?.isValid !== false &&
      iaValidations.specs_proof?.isValid !== false
    );
  };

  // Fonction de validation IA pour un fichier
  const validateWithIA = async (fieldName: 'imei_proof' | 'serial_proof' | 'specs_proof') => {
    const file = uploadedFiles[fieldName]?.file;
    if (!file) return;
    
    setIsIaValidating(prev => ({ ...prev, [fieldName]: true }));
    
    try {
      let dataType: 'imei' | 'serial' | 'specs' = 'imei';
      let userInput: any = {};
      
      switch (fieldName) {
        case 'imei_proof':
          dataType = 'imei';
          userInput = { 
            imei1: watchedValues.imei1,
            serial_number: watchedValues.serial_number
          };
          break;
        case 'serial_proof':
          dataType = 'serial';
          userInput = { serial_number: watchedValues.serial_number };
          break;
        case 'specs_proof':
          dataType = 'specs';
          userInput = { ram: watchedValues.ram, storage: watchedValues.storage };
          break;
      }
      
      const result = await validateImage(file, dataType, userInput);
      setIaValidations(prev => ({ ...prev, [fieldName]: result }));
      
      if (!result.isValid) {
        toast.error(`La vérification IA a échoué pour ${fieldName}. Veuillez corriger les erreurs.`);
      } else {
        toast.success(`Vérification IA réussie pour ${fieldName}!`);
      }
    } catch (error: any) {
      console.error('Erreur lors de la validation IA:', error);
      toast.error(error.message || 'Une erreur est survenue lors de la vérification IA.');
      
      // Créer un résultat d'erreur pour l'affichage
      setIaValidations(prev => ({
        ...prev,
        [fieldName]: {
          isValid: false,
          errors: [error.message || 'Une erreur est survenue lors de la vérification IA.'],
          extractedData: {}
        }
      }));
    } finally {
      setIsIaValidating(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleFileUpload = (fieldName: 'imei_proof' | 'serial_proof' | 'specs_proof', file: File) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setUploadedFiles(prev => ({
        ...prev,
        [fieldName]: { file, preview }
      }));
      
      // Mettre à jour le formulaire
      const fileList = new DataTransfer();
      fileList.items.add(file);
      setValue(fieldName, fileList.files);
      
      // Déclencher la validation IA automatiquement après l'upload
      setTimeout(() => {
        validateWithIA(fieldName);
      }, 1000);
    }
  };

  const removeFile = (fieldName: 'imei_proof' | 'serial_proof' | 'specs_proof') => {
    setUploadedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldName];
      return newFiles;
    });
    setValue(fieldName, undefined as any);
    
    // Supprimer également la validation IA associée
    setIaValidations(prev => {
      const newValidations = { ...prev };
      delete newValidations[fieldName];
      return newValidations;
    });
  };

  const registerPhoneMutation = useMutation({
    mutationFn: async (data: RegisterPhoneRequest) => {
      setPaymentProcessing(true);
      const payment = await paymentService.initiatePayment(1500, 'registration');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await paymentService.verifyPayment(payment.reference);
      return phoneService.registerPhone(data);
    },
    onSuccess: () => {
      toast.success('Téléphone enregistré avec succès!');
      navigate('/phones');
    },
    onError: (error: any) => {
      // Gérer les erreurs sans redirection automatique
      if (error.response?.status === 401) {
        toast.error('Erreur d\'authentification. Veuillez vous reconnecter.');
      } else if (error.response?.status === 403) {
        toast.error('Accès refusé. Vérifiez vos permissions.');
      } else if (error.response?.status === 429) {
        toast.error('Trop de requêtes. Veuillez réessayer plus tard.');
      } else {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
      }
      setPaymentProcessing(false);
    },
  });

  const onSubmit = (data: FormData) => {
    const phoneData: RegisterPhoneRequest = {
      imei1: data.imei1,
      imei2: data.imei2,
      brand: data.brand,
      model: data.model,
      ram: data.ram,
      storage: data.storage,
      serial_number: data.serial_number,
      imei_proof: uploadedFiles.imei_proof!.file,
      serial_proof: uploadedFiles.serial_proof!.file,
      specs_proof: uploadedFiles.specs_proof!.file,
    };

    registerPhoneMutation.mutate(phoneData);
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(['imei1', 'imei2', 'brand', 'model', 'ram', 'storage', 'serial_number']);
      if (isValid && isStep1Valid()) {
        setStep(2);
      } else {
        toast.error('Veuillez remplir tous les champs obligatoires');
      }
    } else if (step === 2) {
      // Vérifier si toutes les validations IA sont terminées
      const allValidationsComplete = 
        iaValidations.imei_proof !== undefined &&
        iaValidations.serial_proof !== undefined &&
        iaValidations.specs_proof !== undefined;
      
      if (isStep2Valid() && allValidationsComplete) {
        setStep(3);
      } else {
        // Si les validations IA n'ont pas encore été effectuées, les déclencher
        if (!allValidationsComplete) {
          if (!iaValidations.imei_proof) await validateWithIA('imei_proof');
          if (!iaValidations.serial_proof) await validateWithIA('serial_proof');
          if (!iaValidations.specs_proof) await validateWithIA('specs_proof');
        }
        
        toast.error('Veuillez télécharger toutes les preuves demandées et attendre la validation IA');
      }
    }
  };

  const brands = [
    'Acer', 'Alcatel', 'Apple', 'Archos', 'Asus', 'BlackBerry', 'Blu', 'Bontel', 'Cat', 'Cherry Mobile',
    'Condor', 'Cubot', 'Demi', 'Doogee', 'Elephone', 'Energizer', 'Evertek', 'Fairphone', 'Fero', 'Gionee',
    'Google (Pixel)', 'GTel', 'Hisense', 'Honor', 'HTC', 'Huawei', 'iQOO', 'Imose', 'Infinix', 'Innoson',
    'iRulu', 'itel', 'Karbonn', 'Lava', 'LeEco', 'Lenovo', 'LG', 'Mara', 'Meizu', 'Microsoft (Lumia)',
    'Mobicel', 'Motorola', 'Nokia', 'Nothing', 'Nubia', 'OnePlus', 'Oppo', 'Oukitel', 'Palm', 'Poco',
    'Plum', 'Prestigio', 'Realme', 'Redmi', 'Samsung', 'Sharp', 'Sico', 'Sony', 'Stylo', 'Symphony',
    'Tecno', 'TCL', 'Ulefone', 'Umidigi', 'Vivo', 'Wiko', 'X-Tigi', 'Xiaomi', 'Yota', 'ZTE', 'ZUK'
  ];

  const ramOptions = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'];
  const storageOptions = ['512MB', '1GB', '2GB', '16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];

  if (paymentProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Traitement du paiement en cours...</p>
          <p className="text-emerald-200 mt-2">Montant: 1 500 FCFA</p>
        </div>
      </div>
    );
  }

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
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-white/10 backdrop-blur-lg rounded-full p-6 border border-white/20 mx-auto w-20 h-20 flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Enregistrer un téléphone
            </h1>
            <p className="text-lg lg:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              Protégez votre téléphone en 3 étapes simples
            </p>
          </div>

          {/* Progress Steps */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
            <div className="flex items-center justify-between">
              <div className={`flex items-center transition-all duration-300 ${
                step >= 1 ? 'text-white' : 'text-white/50'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step >= 1 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                    : 'bg-white/20 text-white/50'
                }`}>
                  {step > 1 ? <Check className="w-6 h-6" /> : '1'}
                </div>
                <span className="ml-3 font-semibold text-lg">Informations</span>
              </div>
              
              <div className={`flex-1 h-2 mx-6 rounded-full transition-all duration-300 ${
                step >= 2 ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-white/20'
              }`}></div>
              
              <div className={`flex items-center transition-all duration-300 ${
                step >= 2 ? 'text-white' : 'text-white/50'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step >= 2 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                    : 'bg-white/20 text-white/50'
                }`}>
                  {step > 2 ? <Check className="w-6 h-6" /> : '2'}
                </div>
                <span className="ml-3 font-semibold text-lg">Preuves</span>
              </div>
              
              <div className={`flex-1 h-2 mx-6 rounded-full transition-all duration-300 ${
                step >= 3 ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-white/20'
              }`}></div>
              
              <div className={`flex items-center transition-all duration-300 ${
                step >= 3 ? 'text-white' : 'text-white/50'
              }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step >= 3 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' 
                    : 'bg-white/20 text-white/50'
                }`}>
                  3
                </div>
                <span className="ml-3 font-semibold text-lg">Paiement</span>
              </div>
            </div>
          </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Information */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Smartphone className="w-6 h-6 mr-3 text-emerald-400" />
                Informations du téléphone
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <IMEIInput
                  label="IMEI 1"
                  required
                  register={register('imei1', {
                    required: 'IMEI 1 est obligatoire',
                    pattern: {
                      value: /^[0-9]{15}$/,
                      message: 'IMEI doit contenir exactement 15 chiffres',
                    },
                  })}
                  error={errors.imei1?.message}
                  placeholder="Premier IMEI (15 chiffres)"
                />

                <IMEIInput
                  label="IMEI 2"
                  required
                  register={register('imei2', {
                    required: 'IMEI 2 est obligatoire',
                    pattern: {
                      value: /^[0-9]{15}$/,
                      message: 'IMEI doit contenir exactement 15 chiffres',
                    },
                  })}
                  error={errors.imei2?.message}
                  placeholder="Second IMEI (15 chiffres)"
                />

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Marque <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...register('brand', { required: 'La marque est obligatoire' })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                  >
                    <option value="" className="bg-gray-800 text-white">Sélectionner une marque</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand} className="bg-gray-800 text-white">
                        {brand}
                      </option>
                    ))}
                  </select>
                  {errors.brand && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.brand.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Modèle <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('model', { required: 'Le modèle est obligatoire' })}
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                    placeholder="Ex: iPhone 13 Pro"
                  />
                  {errors.model && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.model.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Numéro de série <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register('serial_number', { required: 'Le numéro de série est obligatoire' })}
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                    placeholder="Numéro de série du téléphone"
                  />
                  {errors.serial_number && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.serial_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    RAM <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...register('ram', { required: 'La RAM est obligatoire' })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                  >
                    <option value="" className="bg-gray-800 text-white">Sélectionner la RAM</option>
                    {ramOptions.map((ram) => (
                      <option key={ram} value={ram} className="bg-gray-800 text-white">
                        {ram}
                      </option>
                    ))}
                  </select>
                  {errors.ram && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.ram.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Stockage <span className="text-red-400">*</span>
                  </label>
                  <select
                    {...register('storage', { required: 'Le stockage est obligatoire' })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 focus:outline-none transition-all duration-300 hover:bg-white/15"
                  >
                    <option value="" className="bg-gray-800 text-white">Sélectionner le stockage</option>
                    {storageOptions.map((storage) => (
                      <option key={storage} value={storage} className="bg-gray-800 text-white">
                        {storage}
                      </option>
                    ))}
                  </select>
                  {errors.storage && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.storage.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isStep1Valid()}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  isStep1Valid()
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                <span>Suivant</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Preuves */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FileImage className="w-6 h-6 mr-3 text-emerald-400" />
                Preuves de propriété
              </h2>
              
              <div className="space-y-8">
                {/* Upload IMEI Proof */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-4">
                    Capture IMEI <span className="text-red-400">*</span>
                  </label>
                  {uploadedFiles.imei_proof ? (
                    <div className="relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                          <img 
                            src={uploadedFiles.imei_proof.preview} 
                            alt="IMEI Proof" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{uploadedFiles.imei_proof.file.name}</p>
                          <p className="text-sm text-white/70">
                            {(uploadedFiles.imei_proof.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {/* Indicateur de validation IA */}
                          <IAValidationIndicator 
                            isAnalyzing={isIaValidating.imei_proof}
                            validationResult={iaValidations.imei_proof}
                            onRetry={() => validateWithIA('imei_proof')}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('imei_proof')}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Affichage des erreurs IA */}
                      {iaValidations.imei_proof && !iaValidations.imei_proof.isValid && (
                        <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                          <p className="text-sm text-red-200 font-medium">Erreurs de validation :</p>
                          <ul className="mt-1 text-xs text-red-100">
                            {iaValidations.imei_proof.errors.map((error, index) => (
                              <li key={index} className="list-disc list-inside">• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('imei_proof', file);
                        }}
                        className="sr-only"
                        id="imei_proof"
                      />
                      <label
                        htmlFor="imei_proof"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer bg-white/5 backdrop-blur-lg hover:bg-white/10 hover:border-emerald-400 transition-all duration-300 group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-white/60 group-hover:text-emerald-400 transition-colors duration-300" />
                          <p className="mb-2 text-sm text-white/80 group-hover:text-white">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glisser-déposer
                          </p>
                          <p className="text-xs text-white/60">PNG, JPG jusqu'à 10MB</p>
                        </div>
                      </label>
                    </div>
                  )}
                  {errors.imei_proof && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.imei_proof.message}
                    </p>
                  )}
                </div>

                {/* Upload Serial Proof */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-4">
                    Capture numéro de série <span className="text-red-400">*</span>
                  </label>
                  {uploadedFiles.serial_proof ? (
                    <div className="relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                          <img 
                            src={uploadedFiles.serial_proof.preview} 
                            alt="Serial Proof" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{uploadedFiles.serial_proof.file.name}</p>
                          <p className="text-sm text-white/70">
                            {(uploadedFiles.serial_proof.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {/* Indicateur de validation IA */}
                          <IAValidationIndicator 
                            isAnalyzing={isIaValidating.serial_proof}
                            validationResult={iaValidations.serial_proof}
                            onRetry={() => validateWithIA('serial_proof')}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('serial_proof')}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Affichage des erreurs IA */}
                      {iaValidations.serial_proof && !iaValidations.serial_proof.isValid && (
                        <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                          <p className="text-sm text-red-200 font-medium">Erreurs de validation :</p>
                          <ul className="mt-1 text-xs text-red-100">
                            {iaValidations.serial_proof.errors.map((error, index) => (
                              <li key={index} className="list-disc list-inside">• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('serial_proof', file);
                        }}
                        className="sr-only"
                        id="serial_proof"
                      />
                      <label
                        htmlFor="serial_proof"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer bg-white/5 backdrop-blur-lg hover:bg-white/10 hover:border-emerald-400 transition-all duration-300 group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-white/60 group-hover:text-emerald-400 transition-colors duration-300" />
                          <p className="mb-2 text-sm text-white/80 group-hover:text-white">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glisser-déposer
                          </p>
                          <p className="text-xs text-white/60">PNG, JPG jusqu'à 10MB</p>
                        </div>
                      </label>
                    </div>
                  )}
                  {errors.serial_proof && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.serial_proof.message}
                    </p>
                  )}
                </div>

                {/* Upload Specs Proof */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-4">
                    Capture RAM & Stockage <span className="text-red-400">*</span>
                  </label>
                  {uploadedFiles.specs_proof ? (
                    <div className="relative bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-4 group hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                          <img 
                            src={uploadedFiles.specs_proof.preview} 
                            alt="Specs Proof" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{uploadedFiles.specs_proof.file.name}</p>
                          <p className="text-sm text-white/70">
                            {(uploadedFiles.specs_proof.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {/* Indicateur de validation IA */}
                          <IAValidationIndicator 
                            isAnalyzing={isIaValidating.specs_proof}
                            validationResult={iaValidations.specs_proof}
                            onRetry={() => validateWithIA('specs_proof')}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('specs_proof')}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Affichage des erreurs IA */}
                      {iaValidations.specs_proof && !iaValidations.specs_proof.isValid && (
                        <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                          <p className="text-sm text-red-200 font-medium">Erreurs de validation :</p>
                          <ul className="mt-1 text-xs text-red-100">
                            {iaValidations.specs_proof.errors.map((error, index) => (
                              <li key={index} className="list-disc list-inside">• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload('specs_proof', file);
                        }}
                        className="sr-only"
                        id="specs_proof"
                      />
                      <label
                        htmlFor="specs_proof"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer bg-white/5 backdrop-blur-lg hover:bg-white/10 hover:border-emerald-400 transition-all duration-300 group"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-white/60 group-hover:text-emerald-400 transition-colors duration-300" />
                          <p className="mb-2 text-sm text-white/80 group-hover:text-white">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glisser-déposer
                          </p>
                          <p className="text-xs text-white/60">PNG, JPG jusqu'à 10MB</p>
                        </div>
                      </label>
                    </div>
                  )}
                  {errors.specs_proof && (
                    <p className="mt-2 text-sm text-red-300 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.specs_proof.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 bg-white/10 text-white/90 border border-white/20 hover:bg-white/20 hover:text-white shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Précédent</span>
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                disabled={!isStep2Valid() || isIaValidating.imei_proof || isIaValidating.serial_proof || isIaValidating.specs_proof}
                className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  isStep2Valid() && !isIaValidating.imei_proof && !isIaValidating.serial_proof && !isIaValidating.specs_proof
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-white/10 text-white/50 cursor-not-allowed'
                }`}
              >
                <span>Suivant</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Paiement */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Check className="w-6 h-6 mr-3 text-emerald-400" />
                Finalisation et paiement
              </h2>
              
              <div className="bg-emerald-500/20 backdrop-blur-lg border border-emerald-500/30 rounded-2xl p-6 mb-8">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-emerald-300 mt-0.5 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-emerald-100 mb-2">
                      Frais d'enregistrement
                    </h3>
                    <p className="text-emerald-200 leading-relaxed">
                      Un paiement unique de <span className="font-bold text-xl text-white">1 500 FCFA</span> est requis pour enregistrer votre téléphone dans notre base de données sécurisée.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    {...register('accept_terms', { 
                      required: 'Vous devez accepter les conditions' 
                    })}
                    type="checkbox"
                    className="mt-1 h-5 w-5 text-emerald-600 bg-white/10 border-white/20 rounded focus:ring-emerald-400 focus:ring-offset-0"
                  />
                  <span className="text-sm text-white/90 leading-relaxed group-hover:text-white transition-colors duration-300">
                    J'accepte les{' '}
                    <a href="/cgu" target="_blank" className="text-emerald-300 hover:text-emerald-200 font-medium underline decoration-emerald-300/50 hover:decoration-emerald-200">
                      conditions générales d'utilisation
                    </a>{' '}
                    et je confirme que les informations fournies sont exactes.
                  </span>
                </label>
                {errors.accept_terms && (
                  <p className="text-sm text-red-300 flex items-center ml-8">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.accept_terms.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 bg-white/10 text-white/90 border border-white/20 hover:bg-white/20 hover:text-white shadow-lg hover:shadow-xl"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Précédent</span>
              </button>
              <button
                type="submit"
                disabled={registerPhoneMutation.isPending}
                className="px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {registerPhoneMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Payer et enregistrer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPhonePage;