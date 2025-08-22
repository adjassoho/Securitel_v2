import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { agentService } from '@/services/api';
import { ArrowLeft, Upload, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateClientForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  id_type: 'cni' | 'passport' | 'voter_card';
  id_number: string;
  id_document: FileList;
}

const CreateClientPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [clientCreated, setClientCreated] = useState(false);
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateClientForm>();

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setValue('password', password);
    setShowPassword(true);
  };

  const onSubmit = async (data: CreateClientForm) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('address', data.address);
      formData.append('id_type', data.id_type);
      formData.append('id_number', data.id_number);
      formData.append('id_document', data.id_document[0]);

      const response = await agentService.createClientAccount(formData);
      
      toast.success('Compte client créé avec succès!');
      setClientCreated(true);
      setCreatedClientId(response.user.id);
      
      // Afficher les informations de connexion
      toast((t) => (
        <div className="space-y-2">
          <p className="font-semibold">Informations de connexion:</p>
          <p className="text-sm">Email: {data.email}</p>
          <p className="text-sm">Mot de passe: {data.password}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`Email: ${data.email}\nMot de passe: ${data.password}`);
              toast.dismiss(t.id);
              toast.success('Informations copiées!');
            }}
            className="mt-2 px-3 py-1 bg-primary-600 text-white rounded text-sm"
          >
            Copier les informations
          </button>
        </div>
      ), { duration: 10000 });
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  if (clientCreated && createdClientId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compte client créé avec succès!</h2>
            <p className="text-gray-600 mb-8">
              Le client a reçu ses identifiants par email. Vous pouvez maintenant enregistrer son téléphone.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate(`/agent/register-phone?client_id=${createdClientId}`)}
                className="w-full btn-primary"
              >
                Enregistrer un téléphone pour ce client
              </button>
              <button
                onClick={() => navigate('/agent/create-client')}
                className="w-full btn-secondary"
              >
                Créer un autre compte client
              </button>
              <button
                onClick={() => navigate('/agent/dashboard')}
                className="w-full btn-secondary"
              >
                Retour au tableau de bord
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
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/agent/dashboard')}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </button>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Créer un compte client</h1>
          <p className="mt-2 text-gray-600">
            Créez un compte pour un client qui ne peut pas s'inscrire lui-même
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Informations personnelles */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Prénom *</label>
                <input
                  {...register('first_name', { required: 'Le prénom est obligatoire' })}
                  type="text"
                  className="input"
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="label">Nom *</label>
                <input
                  {...register('last_name', { required: 'Le nom est obligatoire' })}
                  type="text"
                  className="input"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Email *</label>
                <input
                  {...register('email', {
                    required: 'L\'email est obligatoire',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  type="email"
                  className="input"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="label">Téléphone *</label>
                <input
                  {...register('phone', {
                    required: 'Le téléphone est obligatoire',
                    pattern: {
                      value: /^[+]?[0-9]{8,}$/,
                      message: 'Numéro de téléphone invalide',
                    },
                  })}
                  type="tel"
                  className="input"
                  placeholder="+229 XX XX XX XX"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Adresse complète *</label>
              <textarea
                {...register('address', { required: 'L\'adresse est obligatoire' })}
                className="input"
                rows={3}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Pièce d'identité */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pièce d'identité</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Type de pièce *</label>
                <select
                  {...register('id_type', { required: 'Le type de pièce est obligatoire' })}
                  className="input"
                >
                  <option value="">Sélectionner</option>
                  <option value="cni">Carte Nationale d'Identité</option>
                  <option value="passport">Passeport</option>
                  <option value="voter_card">Carte d'électeur</option>
                </select>
                {errors.id_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.id_type.message}</p>
                )}
              </div>

              <div>
                <label className="label">Numéro de la pièce *</label>
                <input
                  {...register('id_number', { required: 'Le numéro de pièce est obligatoire' })}
                  type="text"
                  className="input"
                />
                {errors.id_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.id_number.message}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="label">Photo ou scan de la pièce *</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="id_document" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                      <span>Télécharger un fichier</span>
                      <input
                        id="id_document"
                        {...register('id_document', { required: 'La pièce d\'identité est obligatoire' })}
                        type="file"
                        className="sr-only"
                        accept="image/*,.pdf"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF jusqu'à 10MB</p>
                </div>
              </div>
              {errors.id_document && (
                <p className="mt-1 text-sm text-red-600">{errors.id_document.message}</p>
              )}
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mot de passe</h2>
            
            <div>
              <label className="label">Mot de passe *</label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <input
                    {...register('password', {
                      required: 'Le mot de passe est obligatoire',
                      minLength: {
                        value: 8,
                        message: 'Le mot de passe doit contenir au moins 8 caractères',
                      },
                    })}
                    type={showPassword ? 'text' : 'password'}
                    className="input pr-10"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Générer
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              {generatedPassword && (
                <p className="mt-2 text-sm text-green-600">
                  Mot de passe généré: {generatedPassword}
                </p>
              )}
            </div>
          </div>

          {/* Attestation */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Attestation</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>En créant ce compte, j'atteste que :</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>J'ai vérifié l'identité du client</li>
                    <li>Les informations fournies sont exactes et complètes</li>
                    <li>Le client a donné son consentement pour la création du compte</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/agent/dashboard')}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Création en cours...' : 'Créer le compte client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClientPage;
