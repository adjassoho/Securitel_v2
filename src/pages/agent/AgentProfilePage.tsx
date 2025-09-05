import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { agentService } from '@/services/api';
import {
  User,
  Phone,
  Camera,
  Save,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowLeft,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Schéma de validation pour le profil agent
const agentProfileSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Le numéro de téléphone doit contenir au moins 10 chiffres'),
  address: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
  city: z.string().min(2, 'La ville doit contenir au moins 2 caractères'),
  country: z.string().min(2, 'Le pays doit contenir au moins 2 caractères'),
  birth_date: z.string().min(1, 'La date de naissance est obligatoire'),
  id_type: z.enum(['cni', 'passport', 'carte_sejour']),
  id_number: z.string().min(5, 'Le numéro de pièce d\'identité doit contenir au moins 5 caractères'),
  id_issue_date: z.string().min(1, 'La date d\'émission est obligatoire'),
  id_expiry_date: z.string().min(1, 'La date d\'expiration est obligatoire'),
  id_issuer: z.string().min(2, 'L\'émetteur doit contenir au moins 2 caractères'),
  emergency_contact_name: z.string().min(2, 'Le nom du contact d\'urgence doit contenir au moins 2 caractères'),
  emergency_contact_phone: z.string().min(10, 'Le numéro du contact d\'urgence doit contenir au moins 10 chiffres'),
  emergency_contact_relation: z.string().min(2, 'La relation doit contenir au moins 2 caractères'),
});

type AgentProfileFormData = z.infer<typeof agentProfileSchema>;

const AgentProfilePage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [justification, setJustification] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AgentProfileFormData>({
    resolver: zodResolver(agentProfileSchema),
  });

  // Récupération du profil agent
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['agent-profile'],
    queryFn: agentService.getProfile,
  });

  // Récupération des statistiques
  const { data: stats } = useQuery({
    queryKey: ['agent-stats'],
    queryFn: agentService.getStats,
  });

  // Mutation pour la mise à jour du profil
  const updateProfileMutation = useMutation({
    mutationFn: (data: FormData) => agentService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profil mis à jour avec succès !');
      setShowJustificationModal(false);
      setJustification('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du profil');
    },
  });

  // Mutation pour le changement de mot de passe
  const changePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string; confirm_password: string }) =>
      agentService.changePassword(data),
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès !');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    },
  });

  // Pré-remplissage du formulaire avec les données du profil
  useState(() => {
    if (profile) {
      Object.keys(profile).forEach((key) => {
        if (key in agentProfileSchema.shape) {
          setValue(key as keyof AgentProfileFormData, (profile as any)[key]);
        }
      });
    }
  });

  const onSubmit = () => {
    setShowJustificationModal(true);
  };

  const handleConfirmUpdate = () => {
    if (!justification.trim()) {
      toast.error('Veuillez fournir une justification pour la modification');
      return;
    }

    const formData = new FormData();
    Object.entries(watch()).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formData.append('justification', justification);

    updateProfileMutation.mutate(formData);
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      current_password: formData.get('current_password') as string,
      new_password: formData.get('new_password') as string,
      confirm_password: formData.get('confirm_password') as string,
    };

    if (data.new_password !== data.confirm_password) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    changePasswordMutation.mutate(data);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/agent/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Mon Profil</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Agent depuis {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Informations personnelles
                </h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      {...register('first_name')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      {...register('last_name')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+225 XX XX XX XX"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Adresse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse complète *
                  </label>
                  <textarea
                    {...register('address')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre adresse complète"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      {...register('city')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre ville"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays *
                    </label>
                    <input
                      {...register('country')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Votre pays"
                    />
                    {errors.country && (
                      <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                {/* Date de naissance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance *
                  </label>
                  <input
                    {...register('birth_date')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.birth_date && (
                    <p className="mt-1 text-sm text-red-600">{errors.birth_date.message}</p>
                  )}
                </div>

                {/* Pièce d'identité */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Pièce d'identité
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de pièce *
                      </label>
                      <select
                        {...register('id_type')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner un type</option>
                        <option value="cni">CNI</option>
                        <option value="passport">Passeport</option>
                        <option value="carte_sejour">Carte de séjour</option>
                      </select>
                      {errors.id_type && (
                        <p className="mt-1 text-sm text-red-600">{errors.id_type.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de pièce *
                      </label>
                      <input
                        {...register('id_number')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Numéro de votre pièce d'identité"
                      />
                      {errors.id_number && (
                        <p className="mt-1 text-sm text-red-600">{errors.id_number.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'émission *
                      </label>
                      <input
                        {...register('id_issue_date')}
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.id_issue_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.id_issue_date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'expiration *
                      </label>
                      <input
                        {...register('id_expiry_date')}
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.id_expiry_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.id_expiry_date.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Émetteur *
                      </label>
                      <input
                        {...register('id_issuer')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Préfecture d'Abidjan"
                      />
                      {errors.id_issuer && (
                        <p className="mt-1 text-sm text-red-600">{errors.id_issuer.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact d'urgence */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-blue-600" />
                    Contact d'urgence
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <input
                        {...register('emergency_contact_name')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom du contact d'urgence"
                      />
                      {errors.emergency_contact_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone *
                      </label>
                      <input
                        {...register('emergency_contact_phone')}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+225 XX XX XX XX"
                      />
                      {errors.emergency_contact_phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relation *
                      </label>
                      <input
                        {...register('emergency_contact_relation')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Époux(se), Parent, Frère/Sœur"
                      />
                      {errors.emergency_contact_relation && (
                        <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_relation.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bouton de sauvegarde */}
                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {updateProfileMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder les modifications
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo de profil */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-blue-600" />
                Photo de profil
              </h3>
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {(profile as any)?.profile_picture ? (
                    <img
                      src={(profile as any).profile_picture}
                      alt="Photo de profil"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Changer la photo
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-blue-600" />
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Enregistrements totaux</span>
                  <span className="font-semibold text-gray-900">
                    {stats?.total_registrations || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Validés</span>
                  <span className="font-semibold text-green-600">
                    {stats?.validated_registrations || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">En attente</span>
                  <span className="font-semibold text-yellow-600">
                    {stats?.pending_registrations || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenus totaux</span>
                  <span className="font-semibold text-green-600">
                    {stats?.total_revenue ? `${stats.total_revenue.toLocaleString()} FCFA` : '0 FCFA'}
                  </span>
                </div>
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Sécurité
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      name="current_password"
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Votre mot de passe actuel"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    name="new_password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nouveau mot de passe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    name="confirm_password"
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirmer le nouveau mot de passe"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {changePasswordMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  Changer le mot de passe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de justification */}
      {showJustificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Justification requise
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              Toute modification de profil nécessite une justification pour validation par l'administrateur.
            </p>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Expliquez pourquoi vous modifiez ces informations..."
            />
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowJustificationModal(false);
                  setJustification('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmUpdate}
                disabled={!justification.trim() || updateProfileMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isPending ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentProfilePage;
