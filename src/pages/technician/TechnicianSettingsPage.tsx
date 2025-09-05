import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { technicianService } from '@/services/api';
import {
  User,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowLeft,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  working_hours: z.string().min(1, 'Heures de travail requises'),
  service_areas: z.array(z.string()).min(1, 'Au moins une zone de service requise'),
  contact_phone: z.string().min(10, 'Numéro de téléphone requis'),
  emergency_contact: z.string().min(10, 'Contact d\'urgence requis'),
  bank_details: z.object({
    bank_name: z.string(),
    account_number: z.string(),
    account_holder: z.string(),
  }).optional(),
  mobile_money_details: z.object({
    provider: z.enum(['mtn', 'moov', 'orange']),
    phone_number: z.string(),
    account_name: z.string(),
  }).optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Mot de passe actuel requis'),
  new_password: z.string().min(6, 'Nouveau mot de passe doit contenir au moins 6 caractères'),
  confirm_password: z.string().min(1, 'Confirmation du mot de passe requise'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm_password'],
});

type SettingsFormData = z.infer<typeof settingsSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const TechnicianSettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['technician-profile'],
    queryFn: technicianService.getProfile,
  });

  const {
    register: registerSettings,
    handleSubmit: handleSubmitSettings,
    formState: { errors: settingsErrors },
    setValue,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: SettingsFormData) => technicianService.updateSettings(data),
    onSuccess: () => {
      toast.success('Paramètres mis à jour avec succès !');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: PasswordFormData) => technicianService.changePassword(data),
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès !');
      resetPassword();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    },
  });

  const onSettingsSubmit = (data: SettingsFormData) => {
    updateSettingsMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePasswordMutation.mutate(data);
  };

  const addServiceArea = () => {
    const currentAreas = watch('service_areas') || [];
    setValue('service_areas', [...currentAreas, '']);
  };

  const removeServiceArea = (index: number) => {
    const currentAreas = watch('service_areas') || [];
    setValue('service_areas', currentAreas.filter((_, i) => i !== index));
  };

  const updateServiceArea = (index: number, value: string) => {
    const currentAreas = watch('service_areas') || [];
    const newAreas = [...currentAreas];
    newAreas[index] = value;
    setValue('service_areas', newAreas);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  const serviceAreas = watch('service_areas') || [''];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/technician/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Gérez vos paramètres de compte</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'profile'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <User className="h-4 w-4 mr-3" />
              Profil
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'security'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Shield className="h-4 w-4 mr-3" />
              Sécurité
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === 'payment'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="h-4 w-4 mr-3" />
              Paiement
            </button>
          </nav>
        </div>

        {/* Contenu */}
        <div className="lg:col-span-3">
          {/* Onglet Profil */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations du profil</h2>
              
              <form onSubmit={handleSubmitSettings(onSettingsSubmit)} className="space-y-6">
                {/* Heures de travail */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heures de travail *
                  </label>
                  <input
                    {...registerSettings('working_hours')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 8h00 - 18h00, Lundi - Vendredi"
                    defaultValue={profile?.working_hours || ''}
                  />
                  {settingsErrors.working_hours && (
                    <p className="mt-1 text-sm text-red-600">{settingsErrors.working_hours.message}</p>
                  )}
                </div>

                {/* Zones de service */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zones de service *
                  </label>
                  <div className="space-y-2">
                    {serviceAreas.map((area, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={area}
                          onChange={(e) => updateServiceArea(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Abidjan, Cocody"
                        />
                        {serviceAreas.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeServiceArea(index)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addServiceArea}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Ajouter une zone
                    </button>
                  </div>
                  {settingsErrors.service_areas && (
                    <p className="mt-1 text-sm text-red-600">{settingsErrors.service_areas.message}</p>
                  )}
                </div>

                {/* Téléphone de contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone de contact *
                  </label>
                  <input
                    {...registerSettings('contact_phone')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+225 XX XX XX XX"
                    defaultValue={profile?.contact_phone || ''}
                  />
                  {settingsErrors.contact_phone && (
                    <p className="mt-1 text-sm text-red-600">{settingsErrors.contact_phone.message}</p>
                  )}
                </div>

                {/* Contact d'urgence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact d'urgence *
                  </label>
                  <input
                    {...registerSettings('emergency_contact')}
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+225 XX XX XX XX"
                    defaultValue={profile?.emergency_contact || ''}
                  />
                  {settingsErrors.emergency_contact && (
                    <p className="mt-1 text-sm text-red-600">{settingsErrors.emergency_contact.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={updateSettingsMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {updateSettingsMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Sauvegarder
                </button>
              </form>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Sécurité</h2>
              
              <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      {...registerPassword('current_password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      placeholder="Votre mot de passe actuel"
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
                  {passwordErrors.current_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.current_password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    {...registerPassword('new_password')}
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nouveau mot de passe"
                  />
                  {passwordErrors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.new_password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    {...registerPassword('confirm_password')}
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                  {passwordErrors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirm_password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={changePasswordMutation.isPending}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
          )}

          {/* Onglet Paiement */}
          {activeTab === 'payment' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations de paiement</h2>
              
              <div className="space-y-6">
                {/* Détails bancaires */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Détails bancaires</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de la banque
                      </label>
                      <input
                        {...registerSettings('bank_details.bank_name')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: BICICI"
                        defaultValue={profile?.bank_details?.bank_name || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de compte
                      </label>
                      <input
                        {...registerSettings('bank_details.account_number')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Numéro de compte"
                        defaultValue={profile?.bank_details?.account_number || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Titulaire du compte
                      </label>
                      <input
                        {...registerSettings('bank_details.account_holder')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom du titulaire"
                        defaultValue={profile?.bank_details?.account_holder || ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Money */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Mobile Money</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opérateur
                      </label>
                      <select
                        {...registerSettings('mobile_money_details.provider')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        defaultValue={profile?.mobile_money_details?.provider || ''}
                      >
                        <option value="">Sélectionner</option>
                        <option value="mtn">MTN</option>
                        <option value="moov">Moov</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de téléphone
                      </label>
                      <input
                        {...registerSettings('mobile_money_details.phone_number')}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+225 XX XX XX XX"
                        defaultValue={profile?.mobile_money_details?.phone_number || ''}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du compte
                      </label>
                      <input
                        {...registerSettings('mobile_money_details.account_name')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom du compte"
                        defaultValue={profile?.mobile_money_details?.account_name || ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800">Information importante</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Ces informations sont utilisées pour traiter vos retraits. Assurez-vous qu'elles sont correctes.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('profile')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les informations de paiement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianSettingsPage;
