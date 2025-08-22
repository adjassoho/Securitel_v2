import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { phoneService, paymentService } from '@/services/api';
import toast from 'react-hot-toast';
import { Upload, Check, AlertCircle, Smartphone, ShieldCheck, CreditCard } from 'lucide-react';
import type { RegisterPhoneRequest } from '@/types';
import IMEIInput from '@/components/ui/IMEIInput';

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

const RegisterPhonePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const registerPhoneMutation = useMutation({
    mutationFn: async (data: RegisterPhoneRequest) => {
      // Initier le paiement d'abord
      setPaymentProcessing(true);
      const payment = await paymentService.initiatePayment(1500, 'registration');
      
      // Simuler le processus de paiement (dans la vraie app, il y aurait une redirection vers la plateforme de paiement)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Vérifier le paiement
      await paymentService.verifyPayment(payment.reference);
      
      // Enregistrer le téléphone
      return phoneService.registerPhone(data);
    },
    onSuccess: () => {
      toast.success('Téléphone enregistré avec succès!');
      navigate('/phones');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
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
      imei_proof: data.imei_proof[0],
      serial_proof: data.serial_proof[0],
      specs_proof: data.specs_proof[0],
    };

    registerPhoneMutation.mutate(phoneData);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Traitement du paiement en cours...</p>
          <p className="text-sm text-gray-500 mt-2">Montant: 1 500 FCFA</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Enregistrer un téléphone</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              {step > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <span className="ml-2 font-medium">Informations</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              {step > 2 ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <span className="ml-2 font-medium">Preuves</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="ml-2 font-medium">Paiement</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Informations du téléphone</h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <label className="label">Marque *</label>
                  <select
                    {...register('brand', { required: 'La marque est obligatoire' })}
                    className="input"
                  >
                    <option value="">Sélectionner une marque</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Modèle *</label>
                  <input
                    {...register('model', { required: 'Le modèle est obligatoire' })}
                    type="text"
                    className="input"
                    placeholder="Ex: iPhone 13 Pro"
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600">{errors.model.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">RAM *</label>
                  <select
                    {...register('ram', { required: 'La RAM est obligatoire' })}
                    className="input"
                  >
                    <option value="">Sélectionner la RAM</option>
                    {ramOptions.map((ram) => (
                      <option key={ram} value={ram}>
                        {ram}
                      </option>
                    ))}
                  </select>
                  {errors.ram && (
                    <p className="mt-1 text-sm text-red-600">{errors.ram.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Stockage *</label>
                  <select
                    {...register('storage', { required: 'Le stockage est obligatoire' })}
                    className="input"
                  >
                    <option value="">Sélectionner le stockage</option>
                    {storageOptions.map((storage) => (
                      <option key={storage} value={storage}>
                        {storage}
                      </option>
                    ))}
                  </select>
                  {errors.storage && (
                    <p className="mt-1 text-sm text-red-600">{errors.storage.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="label">Numéro de série *</label>
                  <input
                    {...register('serial_number', { required: 'Le numéro de série est obligatoire' })}
                    type="text"
                    className="input"
                  />
                  {errors.serial_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.serial_number.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Preuves */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Preuves de propriété</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="label">Capture IMEI *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Télécharger un fichier</span>
                          <input
                            {...register('imei_proof', { required: 'La capture IMEI est obligatoire' })}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                    </div>
                  </div>
                  {errors.imei_proof && (
                    <p className="mt-1 text-sm text-red-600">{errors.imei_proof.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Capture numéro de série *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Télécharger un fichier</span>
                          <input
                            {...register('serial_proof', { required: 'La capture du numéro de série est obligatoire' })}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                    </div>
                  </div>
                  {errors.serial_proof && (
                    <p className="mt-1 text-sm text-red-600">{errors.serial_proof.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Capture RAM & Stockage *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                          <span>Télécharger un fichier</span>
                          <input
                            {...register('specs_proof', { required: 'La capture des spécifications est obligatoire' })}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
                    </div>
                  </div>
                  {errors.specs_proof && (
                    <p className="mt-1 text-sm text-red-600">{errors.specs_proof.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline"
              >
                Précédent
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Paiement */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Finalisation et paiement</h2>
              
              <div className="bg-primary-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-primary-800">
                      Frais d'enregistrement
                    </h3>
                    <p className="mt-1 text-sm text-primary-700">
                      Un paiement unique de <span className="font-bold">1 500 FCFA</span> est requis pour enregistrer votre téléphone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-start">
                  <input
                    {...register('accept_terms', { 
                      required: 'Vous devez accepter les conditions' 
                    })}
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    J'accepte les{' '}
                    <a href="/cgu" target="_blank" className="text-primary-600 hover:text-primary-500">
                      conditions générales d'utilisation
                    </a>{' '}
                    et je confirme que les informations fournies sont exactes.
                  </span>
                </label>
                {errors.accept_terms && (
                  <p className="text-sm text-red-600">{errors.accept_terms.message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-outline"
              >
                Précédent
              </button>
              <button
                type="submit"
                disabled={registerPhoneMutation.isPending}
                className="btn-primary"
              >
                {registerPhoneMutation.isPending ? 'Traitement...' : 'Payer et enregistrer'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterPhonePage;
