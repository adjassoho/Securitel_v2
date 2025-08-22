import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { agentService } from '@/services/api';
import { ArrowLeft, Upload, CheckCircle, Smartphone, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import IMEIInput from '@/components/ui/IMEIInput';

interface RegisterPhoneForm {
  imei1: string;
  imei2: string;
  brand: string;
  model: string;
  ram: string;
  storage: string;
  serial_number: string;
  imei_proof: FileList;
  serial_proof: FileList;
  specs_proof?: FileList;
  type: 'Smartphone' | 'Touche' | 'Tablette' | 'Autre';
  color?: string;
}

const RegisterPhonePage = () => {
  const { search } = useLocation();
  const clientId = new URLSearchParams(search).get('client_id');
  const [loading, setLoading] = useState(false);
  const [phoneRegistered, setPhoneRegistered] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterPhoneForm>();

  const brands = [
    'Acer', 'Alcatel', 'Apple', 'Archos', 'Asus', 'BlackBerry', 'Blu', 'Bontel', 'Cat', 'Cherry Mobile',
    'Condor', 'Cubot', 'Demi', 'Doogee', 'Elephone', 'Energizer', 'Evertek', 'Fairphone', 'Fero', 'Gionee',
    'Google (Pixel)', 'GTel', 'Hisense', 'Honor', 'HTC', 'Huawei', 'iQOO', 'Imose', 'Infinix', 'Innoson',
    'iRulu', 'itel', 'Karbonn', 'Lava', 'LeEco', 'Lenovo', 'LG', 'Mara', 'Meizu', 'Microsoft (Lumia)',
    'Mobicel', 'Motorola', 'Nokia', 'Nothing', 'Nubia', 'OnePlus', 'Oppo', 'Oukitel', 'Palm', 'Poco',
    'Plum', 'Prestigio', 'Realme', 'Redmi', 'Samsung', 'Sharp', 'Sico', 'Sony', 'Stylo', 'Symphony',
    'Tecno', 'TCL', 'Ulefone', 'Umidigi', 'Vivo', 'Wiko', 'X-Tigi', 'Xiaomi', 'Yota', 'ZTE', 'ZUK'
  ];

  const onSubmit = async (data: RegisterPhoneForm) => {
    if (!clientId) {
      toast.error("Client ID manquant. Veuillez reprendre le processus d'enregistrement.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('imei1', data.imei1);
      formData.append('imei2', data.imei2);
      formData.append('brand', data.brand);
      formData.append('model', data.model);
      formData.append('ram', data.ram);
      formData.append('storage', data.storage);
      formData.append('serial_number', data.serial_number);
      formData.append('imei_proof', data.imei_proof[0]);
      formData.append('serial_proof', data.serial_proof[0]);
      if (data.specs_proof && data.specs_proof.length > 0) {
        formData.append('specs_proof', data.specs_proof[0]);
      }
      formData.append('type', data.type);
      if (data.color) {
        formData.append('color', data.color);
      }

      await agentService.registerClientPhone(clientId, formData);

      toast.success('Téléphone enregistré avec succès!');
      setPhoneRegistered(true);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement du téléphone");
    } finally {
      setLoading(false);
    }
  };

  if (phoneRegistered) {
    return (
      <div className="form-container min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="form-section text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl mb-6">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Téléphone enregistré avec succès!
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Le téléphone a bien été ajouté au compte du client.
            </p>
            <div className="form-actions">
              <button
                onClick={() => window.location.reload()}
                className="btn-form-primary"
              >
                <Smartphone className="w-5 h-5 mr-3" />
                Enregistrer un autre téléphone
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn-form-secondary"
              >
                <ArrowLeft className="w-5 h-5 mr-3" />
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Enregistrer un téléphone
            </h1>
            <p className="text-lg text-gray-600">
              Ajoutez un nouveau téléphone au compte de ce client
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Section IMEI et informations de base */}
            <div className="form-section">
              <div className="form-header flex items-center">
                <Smartphone className="w-6 h-6 mr-3 text-blue-600" />
                Informations sur le téléphone
              </div>
              <div className="form-description">
                Saisissez les informations techniques du téléphone
              </div>

              <div className="form-grid">
                <IMEIInput
                  label="IMEI 1"
                  required
                  register={register('imei1', {
                    required: "L'IMEI 1 est obligatoire",
                    pattern: {
                      value: /^[0-9]{15}$/,
                      message: 'IMEI 1 doit contenir exactement 15 chiffres',
                    },
                  })}
                  error={errors.imei1?.message}
                  placeholder="Premier IMEI (15 chiffres)"
                />

                <IMEIInput
                  label="IMEI 2"
                  required
                  register={register('imei2', {
                    required: "L'IMEI 2 est obligatoire",
                    pattern: {
                      value: /^[0-9]{15}$/,
                      message: 'IMEI 2 doit contenir exactement 15 chiffres',
                    },
                  })}
                  error={errors.imei2?.message}
                  placeholder="Second IMEI (15 chiffres)"
                />

                <div className="form-field">
                  <label className="enhanced-label">Marque *</label>
                  <select
                    {...register('brand', { required: 'La marque est obligatoire' })}
                    className={`enhanced-select ${
                      errors.brand ? 'error-input' : ''
                    }`}
                  >
                    <option value="">Sélectionner une marque</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {errors.brand && (
                    <p className="field-error">{errors.brand.message}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="enhanced-label">Modèle *</label>
                  <input
                    {...register('model', { required: 'Le modèle est obligatoire' })}
                    type="text"
                    className={`enhanced-input ${
                      errors.model ? 'error-input' : ''
                    }`}
                    placeholder="Ex: Galaxy S23, iPhone 14 Pro..."
                  />
                  {errors.model && (
                    <p className="field-error">{errors.model.message}</p>
                  )}
                </div>
              </div>

              <div className="form-grid mt-6">
                <div className="form-field">
                  <label className="enhanced-label">RAM *</label>
                  <input
                    {...register('ram', { required: 'La RAM est obligatoire' })}
                    type="text"
                    className={`enhanced-input ${
                      errors.ram ? 'error-input' : ''
                    }`}
                    placeholder="Ex: 8GB, 12GB..."
                  />
                  {errors.ram && (
                    <p className="field-error">{errors.ram.message}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="enhanced-label">Mémoire Interne *</label>
                  <select
                    {...register('storage', {
                      required: 'La mémoire interne est obligatoire',
                    })}
                    className={`enhanced-select ${
                      errors.storage ? 'error-input' : ''
                    }`}
                  >
                    <option value="">Sélectionner la capacité</option>
                    <option value="512MB">512 MB</option>
                    <option value="1GB">1 Go</option>
                    <option value="2GB">2 Go</option>
                    <option value="16GB">16 GB</option>
                    <option value="32GB">32 GB</option>
                    <option value="64GB">64 GB</option>
                    <option value="128GB">128 GB</option>
                    <option value="256GB">256 GB</option>
                    <option value="512GB">512 GB</option>
                    <option value="1TB">1 TB</option>
                  </select>
                  {errors.storage && (
                    <p className="field-error">{errors.storage.message}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="enhanced-label">Numéro de série (SN) *</label>
                  <input
                    {...register('serial_number', {
                      required: 'Le numéro de série est obligatoire',
                    })}
                    type="text"
                    className={`enhanced-input ${
                      errors.serial_number ? 'error-input' : ''
                    }`}
                    placeholder="Numéro de série du téléphone"
                  />
                  {errors.serial_number && (
                    <p className="field-error">{errors.serial_number.message}</p>
                  )}
                </div>

                <div className="form-field">
                  <label className="enhanced-label">Type de téléphone *</label>
                  <select
                    {...register('type', { required: 'Le type est obligatoire' })}
                    className={`enhanced-select ${
                      errors.type ? 'error-input' : ''
                    }`}
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="Smartphone">📱 Smartphone</option>
                    <option value="Touche">☎️ Téléphone à touche</option>
                    <option value="Tablette">📱 Tablette</option>
                    <option value="Autre">❓ Autre</option>
                  </select>
                  {errors.type && (
                    <p className="field-error">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <div className="form-field">
                  <label className="enhanced-label">Couleur (optionnel)</label>
                  <input
                    {...register('color')}
                    type="text"
                    className="enhanced-input"
                    placeholder="Ex: Noir, Blanc, Bleu..."
                  />
                  <p className="field-help">
                    Précisez la couleur pour faciliter l'identification
                  </p>
                </div>
              </div>
            </div>

            {/* Section téléversement de documents */}
            <div className="form-section">
              <div className="form-header flex items-center">
                <Camera className="w-6 h-6 mr-3 text-blue-600" />
                Téléversement de documents
              </div>
              <div className="form-description">
                Ajoutez les preuves photographiques nécessaires
              </div>

              <div className="form-grid grid-cols-1 md:grid-cols-3">
                <div className="form-field">
                  <label className="enhanced-label">Capture IMEI *</label>
                  <div className="enhanced-file-input">
                    <div className="text-center py-6">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <label className="cursor-pointer">
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Télécharger la capture IMEI
                        </span>
                        <input
                          {...register('imei_proof', {
                            required: "La capture de l'IMEI est obligatoire",
                          })}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG jusqu'à 10MB</p>
                    </div>
                  </div>
                  {errors.imei_proof && (
                    <p className="field-error">{errors.imei_proof.message}</p>
                  )}
                  <p className="field-help">
                    Capture d'écran montrant l'IMEI (paramètres → à propos)
                  </p>
                </div>

                <div className="form-field">
                  <label className="enhanced-label">Capture SN *</label>
                  <div className="enhanced-file-input">
                    <div className="text-center py-6">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <label className="cursor-pointer">
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Télécharger la capture SN
                        </span>
                        <input
                          {...register('serial_proof', {
                            required: 'La capture du SN est obligatoire',
                          })}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG jusqu'à 10MB</p>
                    </div>
                  </div>
                  {errors.serial_proof && (
                    <p className="field-error">{errors.serial_proof.message}</p>
                  )}
                  <p className="field-help">
                    Photo du numéro de série (sous la batterie ou dans les paramètres)
                  </p>
                </div>

                <div className="form-field">
                  <label className="enhanced-label">RAM/Mémoire (optionnel)</label>
                  <div className="enhanced-file-input">
                    <div className="text-center py-6">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <label className="cursor-pointer">
                        <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Télécharger capture RAM/Stockage
                        </span>
                        <input
                          {...register('specs_proof')}
                          type="file"
                          accept="image/*"
                          className="sr-only"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG jusqu'à 10MB</p>
                    </div>
                  </div>
                  <p className="field-help">
                    Capture d'écran des spécifications techniques (optionnel)
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="btn-form-secondary"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-form-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Enregistrer le téléphone
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

export default RegisterPhonePage;

