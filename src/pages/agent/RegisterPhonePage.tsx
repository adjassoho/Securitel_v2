import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { agentService } from '@/services/api';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Téléphone enregistré avec succès!
            </h2>
            <p className="text-gray-600 mb-8">
              Le téléphone a bien été ajouté au compte du client.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-primary"
              >
                Enregistrer un autre téléphone
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full btn-secondary"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </button>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Enregistrer un téléphone</h1>
          <p className="mt-2 text-gray-600">
            Ajoutez un nouveau téléphone au compte de ce client
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          {/* IMEI and Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations sur le téléphone
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">IMEI 1 *</label>
                <input
                  {...register('imei1', {
                    required: "L'IMEI 1 est obligatoire",
                    pattern: {
                      value: /^[0-9]{15}$/,
                      message: 'IMEI 1 invalide',
                    },
                  })}
                  type="text"
                  className="input"
                />
                {errors.imei1 && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.imei1.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">IMEI 2 *</label>
                <input
                  {...register('imei2', {
                    required: "L'IMEI 2 est obligatoire",
                    pattern: {
                      value: /^[0-9]{15}$/,
                      message: 'IMEI 2 invalide',
                    },
                  })}
                  type="text"
                  className="input"
                />
                {errors.imei2 && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.imei2.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Marque *</label>
                <input
                  {...register('brand', { required: 'La marque est obligatoire' })}
                  type="text"
                  className="input"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.brand.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Modèle *</label>
                <input
                  {...register('model', { required: 'Le modèle est obligatoire' })}
                  type="text"
                  className="input"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.model.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">RAM *</label>
                <input
                  {...register('ram', { required: 'La RAM est obligatoire' })}
                  type="text"
                  className="input"
                />
                {errors.ram && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.ram.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Mémoire Interne *</label>
                <input
                  {...register('storage', {
                    required: 'La mémoire interne est obligatoire',
                  })}
                  type="text"
                  className="input"
                />
                {errors.storage && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.storage.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Numéro de série (SN) *</label>
                <input
                  {...register('serial_number', {
                    required: 'Le numéro de série est obligatoire',
                  })}
                  type="text"
                  className="input"
                />
                {errors.serial_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.serial_number.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Type de téléphone *</label>
                <select
                  {...register('type', { required: 'Le type est obligatoire' })}
                  className="input"
                >
                  <option value="">Sélectionner</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Touche">Téléphone à touche</option>
                  <option value="Tablette">Tablette</option>
                  <option value="Autre">Autre</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Couleur (optionnel)</label>
              <input {...register('color')} type="text" className="input" />
            </div>
          </div>

          {/* File Uploads */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Téléversement de documents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Capture IMEI *</label>
                <input
                  {...register('imei_proof', {
                    required: "La capture de l'IMEI est obligatoire",
                  })}
                  type="file"
                  className="input"
                  accept="image/*"
                />
                {errors.imei_proof && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.imei_proof.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Capture SN *</label>
                <input
                  {...register('serial_proof', {
                    required: 'La capture du SN est obligatoire',
                  })}
                  type="file"
                  className="input"
                  accept="image/*"
                />
                {errors.serial_proof && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.serial_proof.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">RAM/Mémoire (optionnel)</label>
                <input
                  {...register('specs_proof')}
                  type="file"
                  className="input"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Enregistrement..." : "Enregistrer le téléphone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPhonePage;

